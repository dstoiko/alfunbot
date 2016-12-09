'use strict';

const smoochBot = require('smooch-bot');
const helpers = require('../helpers');
const MemoryLock = smoochBot.MemoryLock;
const SmoochApiStore = smoochBot.SmoochApiStore;
const SmoochApiBot = smoochBot.SmoochApiBot;
const StateMachine = helpers.StateMachine;
const app = require('../app');
const script = require('../script');
const SmoochCore = require('smooch-core');
const jwt = require('../jwt');

const name = 'SmoochBot';
const avatarUrl = 'https://s.gravatar.com/avatar/f91b04087e0125153623a3778e819c0a?s=80';
const store = new SmoochApiStore({
    jwt
});
const lock = new MemoryLock();
const webhookTriggers = ['message:appUser', 'postback'];
// Initialize Firebase
// const firebase = require('firebase');
// firebase.initializeApp({
//   serviceAccount: "firebase-service.json",
//   databaseURL: "https://.firebaseio.com"
// });
// Firebase services
// var db = firebase.database();
// var ref = db.ref("bot");
// var usersRef = ref.child("users");

function createWebhook(smoochCore, target) {
    return smoochCore.webhooks.create({
        target,
        triggers: webhookTriggers
    })
        .then((res) => {
            console.log('Smooch webhook created with target', res.webhook.target);
        })
        .catch((err) => {
            console.error('Error creating Smooch webhook:', err);
            console.error(err.stack);
        });
}

function updateWebhook(smoochCore, existingWebhook) {
    return smoochCore.webhooks.update(existingWebhook._id, {
        triggers: webhookTriggers
    })
        .then((res) => {
            console.log('Smooch webhook updated with missing triggers', res.webhook.target);
        })
        .catch((err) => {
            console.error('Error updating Smooch webhook:', err);
            console.error(err.stack);
        });
}

// Create a webhook if one doesn't already exist
if (process.env.SERVICE_URL) {
    const target = process.env.SERVICE_URL.replace(/\/$/, '') + '/webhook';
    const smoochCore = new SmoochCore({
        jwt
    });
    smoochCore.webhooks.list()
        .then((res) => {
            const existingWebhook = res.webhooks.find((w) => w.target === target);

            if (!existingWebhook) {
                return createWebhook(smoochCore, target);
            }

            const hasAllTriggers = webhookTriggers.every((t) => {
                return existingWebhook.triggers.indexOf(t) !== -1;
            });

            if (!hasAllTriggers) {
                updateWebhook(smoochCore, existingWebhook);
            }
        });
}

function createBot(appUser) {
    const userId = appUser.userId || appUser._id;
    return new SmoochApiBot({
        name,
        avatarUrl,
        lock,
        store,
        userId
    });
}

function handleMessages(req, res) {
    const messages = req.body.messages.reduce((prev, current) => {
        if (current.role === 'appUser') {
            prev.push(current);
        }
        return prev;
    }, []);

    if (messages.length === 0) {
        return res.end();
    }

    const stateMachine = new StateMachine({
        script,
        bot: createBot(req.body.appUser)
    });

    stateMachine.receiveMessage(messages[0])
        .then(() => res.end())
        .catch((err) => {
            console.error('SmoochBot error:', err);
            console.error(err.stack);
            res.end();
        });
}

function handlePostback(req, res) {

    const stateMachine = new StateMachine({
        script,
        bot: createBot(req.body.appUser)
    });

    const postback = req.body.postbacks[0];
    if (!postback || !postback.action) {
        res.end();
    };

    const smoochPayload = postback.action.payload;
    const buttonText = postback.text;

    // Change conversation state according to postback clicked
    switch (smoochPayload) {
        case 'start':
        case 'pass':
        case 'passRetry':
        case 'postcode':
        case 'emailRetry':
        case 'faq':
        case 'human':
        case 'hello':
            Promise.all([
                stateMachine.bot.releaseLock(),
                stateMachine.setState(smoochPayload),
                stateMachine.prompt(smoochPayload)
            ]);
            res.end();
        break;
        case 'summary':
            const user = req.body.appUser;
            const userId = user.userId || user._id;
            const propsRef = usersRef.child(userId + "/properties")
            const userProps = propsRef.once("value", function(snapshot) {
                var props = snapshot.val();
                stateMachine.bot.say( `Voici un résumé de votre demande :` + '\n'
                + `Date : ` + props.date + '\n'
                + `Code postal : ` + props.postcode + '\n'
                + `Adresse e-mail : ` + props.email + '\n'
                + `Demande : ` + props.ask + '\n'
                + `Veuillez nous indiquer si l'une des informations est fausse.`);
            });
            res.end();
        break;
        default:
            stateMachine.bot.say(`Veuillez sélectionner une option ou contacter un humain de l'équipe: %[Contacter l'équipe](postback:contactRequest)`)
                .then(() => res.end());
    };
}

app.post('/webhook', function(req, res, next) {
    const trigger = req.body.trigger;

    switch (trigger) {
        case 'message:appUser':
            handleMessages(req, res);
            break;

        case 'postback':
            handlePostback(req, res);
            break;

        default:
            console.log('Ignoring unknown webhook trigger:', trigger);
    }
    // Store and update user info into Firebase
    const user = req.body.appUser;
    const userId = user.userId || user._id;
    usersRef.child(userId).update(user);
});

var server = app.listen(process.env.PORT || 8000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Smooch Bot listening at http://%s:%s', host, port);
});
