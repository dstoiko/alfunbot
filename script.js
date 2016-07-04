'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({
    processing: {
        prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        prompt: (bot) => bot.say(`Bienvenue sur Wondor ! Nous offrons actuellement des services de bricolage, déménagement et ménage. Sélectionnez 'Demander un service' pour continuer.
        %[Demander un service](postback:serviceRequest)
        %[Autre demande](postback:contactRequest)
        %[Visiter notre site](http://wondor.co)`),
        receive: () => 'askName'
    },

    askName: {
        prompt: (bot) => bot.say('Comment vous appelez-vous ?'),
        receive: (bot, message) => {
            const name = message.text.trim();
            return bot.setProp('name', name)
                .then(() => bot.say(`Merci ${name} !`))
                .then(() => 'finish');
        }
    },

    finish: {
        receive: (bot, message) => {
            return bot.getProp('name')
                .then((name) => bot.say(`Sorry ${name}, my creator didn't ` +
                        'teach me how to do anything else!'))
                .then(() => 'start');
        }
    }
});
