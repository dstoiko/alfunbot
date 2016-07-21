'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({

    // Welcome, initial state of the bot
    start: {
        receive: (bot) => {
            return bot.say(`Bienvenue sur Wondor ! Nous offrons actuellement des services de bricolage, déménagement et ménage. Sélectionnez une option pour commencer : %[Demander un service](postback:pass) %[Autre demande](postback:faq) %[Visiter notre site](http://wondor.co)`);
        }
    },

    // Password entry for beta test users
    pass: {
        prompt: (bot) => bot.say(`Dites le mot magique... Si vous n'avez pas encore d'invitation, vous pouvez en demander une : %[Invitez-moi !](http://goo.gl/forms/YjYcGDHIzcohI7Az1)`),
        receive: (bot, message) => {
            const pass = message.text.trim();
            if (pass === 'wondorland') {
                return bot.say(`Gagné !`)
                    .then(() => 'postcode');
            }
            else {
                return bot.say(`Désolé, ce n'est pas le bon mot de passe... %[Demander un accès](http://goo.gl/forms/YjYcGDHIzcohI7Az1) %[Réessayer](postback:passRetry)`);
            }
        }
    },
    // Password retry if unsuccessful
    passRetry: {
        receive: (bot, message) => {
            const pass = message.text.trim();
            if (pass === 'wondorland') {
                return bot.say(`Gagné !`)
                    .then(() => 'postcode');;
            }
            else {
                return bot.say(`Toujours pas le bon mot de passe... %[Demander un accès](http://goo.gl/forms/YjYcGDHIzcohI7Az1) %[Réessayer](postback:passRetry)`);
            }
        }
    },

    // Post code and date/time entry (always go one after the other)
    postcode: {
        prompt: (bot) => bot.say(`Quel est votre code postal ?`),
        receive: () => 'date'
    },
    date: {
        prompt: (bot) => bot.say(`Pour quand voulez-vous ce service (date et heure) ?`),
        receive: () => 'servicesRequest'
    },

    // User chooses between available services or suggests a new one
    servicesRequest: {
        prompt: (bot) => bot.say(`Choisissez le type de service que vous voulez:
%[Bricolage](postback:bricolage)
%[Ménage](postback:menage)
%[Déménagement](postback:demenagement)
%[Autre](postback:otherService)`),
        receive: () => 'escape'
    },

    // Specific message depending on service asked
    bricolage: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin de bricolage : petits travaux, peinture, autre ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot) => {
            return bot.say(`Merci, votre demande est prise en compte. Nous revenons vers vous tout de suite avec un tarif estimatif...`)
                .then(() => 'human')
        }
    },
    menage: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin de ménage : nombre de pièces, fenêtres à nettoyer, repassage ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot) => {
            return bot.say(`Merci, votre demande est prise en compte. Nous revenons vers vous tout de suite avec un prix estimatif...`)
                .then(() => 'human')
        }
    },
    demenagement: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin : taille de votre appartement, nombre de cartons, mobilier encombrant... Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service !`),
        receive: (bot) => {
            return bot.say(`Merci, votre demande est prise en compte. Nous revenons vers vous tout de suite avec un prix estimatif...`)
                .then(() => 'human')
        }
    },
    otherService: {
        prompt: (bot) => bot.say(`De quel service auriez-vous besoin ? Dites-nous ce que nous devrions ajouter à notre offre !`),
        receive: (bot) => {
            return bot.say(`Merci pour votre demande. Nous la prenons en compte et essayons d'élargir notre offre au plus vite ! Vous voulez recevoir une notification quand ce service est disponible ? %[Me notifier](http://eepurl.com/b9RLAP)`)
                .then(() => 'human')
        }
    },

    // FAQ to answer most common questions
    faq: {
        prompt: (bot) => bot.say(`Voici les questions qu'on nous pose souvent :`),
        receive: () => 'contactRequest'
    }
    // If FAQ doesn't answer all the user's questions
    contactRequest: {
        prompt: (bot) => bot.say(`Veuillez patienter, un de mes collègues humains va prendre le relais...`)
            .then(() => 'human'),
        receive: () => 'human'
    },

    // Fallback for human to jump in the conversation
    escape: {
        prompt: (bot) => bot.say(`Sélectionnez l'une des options proposées dans le dernier message, nous traiterons votre demande au plus vite ! Voulez-vous parler à notre équipe ?
%[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'contactRequest'
    },
    human: {
        receive: () => 'human'
    },

    // Error handling
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },
    error: {
        prompt: (bot) => bot.say(`Beep Boop... Désolé, il y a une erreur...
%[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'escape'
    }
});
