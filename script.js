'use latest';

const Script = require('smooch-bot').Script;

// Natural language processing module
const natural = require('natural');
// For e-mail validation
const validator = require('validator');

const states = require('./states');

module.exports = new Script({

    processing: {
        // prompt: (bot) => bot.say(states.processing.prompt),
        receive: () => 'processing'
        // receive: () => states.processing.next
    },

    // Initial state of the bot
    start: {
        receive: (bot) => {
            return bot.say(states.start.response)
                .then(() => 'welcome');
        }
    },

    hello: {
      prompt: (bot) => bot.say('Hello again!'),
      receive: () => 'escape'
    },

    welcome: {
        prompt: bot => bot.say('Hello World. %[FAQ](postback:hello)'),
        receive: (bot, message) => bot.say(`Your message: ${JSON.stringify(message, null, 2)}`)
    },

    // Collect user e-mail
    email: {
        prompt: (bot) => bot.say(`Quelle est votre adresse e-mail ?
          Nous utiliserons cette adresse pour vous recontacter`),
        receive: (bot, message) => {
            const email = message.text.trim();
            if (validator.isEmail(email)) { // Validate e-mail format using nifty validator library
                return bot.say(`Merci !`)
                    .then(() => bot.setProp('email', email))
                    .then(() => 'servicesRequest');
            }
            else {
                return bot.say(`Humm... Il semblerait que vous n'ayez pas rentré un e-mail valide... %[Réessayer](postback:emailRetry)`);
            }
        }
    },
    // Email retry if unsuccessful
    emailRetry: {
        prompt: (bot) => bot.say(`Veuilez réécrire votre adresse e-mail`),
        receive: (bot, message) => {
            const email = message.text.trim();
            if (validator.isEmail(email)) { // Validate e-mail format using nifty validator library
                return bot.say(`Merci !`)
                    .then(() => bot.setProp('email', email))
                    .then(() => 'servicesRequest');
            }
            else {
                return bot.say(`Il semblerait que vous n'ayez toujours pas rentré un e-mail valide...
                %[Réessayer](postback:emailRetry)
                %[Contacter l'équipe](postback:contactRequest)`);
            }
        }
    },

    // User chooses between available services or suggests a new one
    servicesRequest: {
        prompt: (bot) => bot.say(`Choisissez le type de service que vous voulez`)
          .then(() => bot.say()),
        receive: () => 'escape'
    },

    // FAQ to answer most common questions
    faq: {
        prompt: (bot) => {
            return bot.say(`Voici les questions qu'on nous pose souvent :
            %[Quand lancez-vous ?](postback:launchDate)
            %[Où ?](postback:citiesAvailable)
            %[Quels services ?](postback:servicesAvailable)
            %[Qui est wondor ?](postback:wondorsProfile)
            %[Quels prix ?](postback:howMuch)
            %[Devenir wondor](postback:workRequest)`)
        },
        receive: () => 'escape'
    },
    // If FAQ doesn't answer all the user's questions
    contactRequest: {
        prompt: (bot) => bot.say(`Veuillez patienter, un de mes collègues humains va prendre le relais...`)
            .then(() => 'human'),
        receive: () => 'human'
    },

    // Waiting message
    wait: {
        prompt: (bot) => {
            return bot.say(`Veuillez patienter, nous revenons vers vous au plus vite avec un tarif estimatif ou une demande de précisions... %[Récapitulatif](postback:summary)`)
                .then(() => 'human')
        },
        receive: () => 'human'
    },

    // Fallback for human to jump in the conversation
    escape: {
        prompt: (bot) => bot.say(`Sélectionnez l'une des options proposées dans le dernier message, nous traiterons votre demande au plus vite ! Voulez-vous parler à quelqu'un de notre équipe ?
        %[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'contactRequest'
    },

    // Send slack notification
    human: {
        receive: (bot, message) => bot.setProp('last', message.received)
          .then(() => {
            if (Date.now() > bot.getProp('last') + 1000) {
              return 'start';
            }
            return;
          })
    },

    // Error handling
    error: {
        prompt: (bot) => bot.say(`Beep Boop... Désolé, il y a une erreur...
%[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'escape'
    }
});
