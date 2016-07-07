'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({

    start: {
        prompt: (bot) => {
            return bot.say(`Bienvenue sur Wondor ! Nous offrons actuellement des services de bricolage, déménagement et ménage. Sélectionnez 'Demander un service' pour continuer.
%[Demander un service](postback:serviceRequest)
%[Autre demande](postback:contactRequest)
%[Visiter notre site](http://wondor.co)`)
        }
    },

    services: {
        prompt: (bot) => bot.say(`Choisissez un type de service :
%[Bricolage](postback:bricolage)
%[Ménage](postback:menage)
%[Déménagement](postback:demenagement)`),
        receive: () => 'escape'
    },

    escape: {
        prompt: (bot) => bot.say(`Sélectionnez l'une des options proposées, nous tratierons votre demande au plus vite ! Voulez-vous parler à notre équipe ?
%[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'contact'
    },

    contact: {
        prompt: (bot) => bot.say(`Veuillez patienter, un de mes collègues humains va prendre le relais...`)
            .then(() => 'finish')
    },

    finish: {
        receive: (bot, message) => {
            return bot.say(`Sorry, GAME OVER...`)
                .then(() => 'start');
        }
    },

    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    error: {
        prompt: (bot) => bot.say('Beep Boop... Désolé, il y a une erreur...'),
        receive: () => 'start'
    }
});
