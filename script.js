'use latest';

const Script = require('smooch-bot').Script;

// Natural language processing module
const natural = require('natural');
// For e-mail validation
const validator = require('validator');

const states = require('./states');

module.exports = new Script({

    processing: {
        receive: () => 'processing'
    },

    // Initial state of the bot
    start: {
        receive: (bot) => {
            return bot.say(states.start.response)
                .then(() => {
                    return bot.say('%[Oui](reply:sessionStart) %[Non](reply:site)')
                })
                .then(() => 'replyButtonProcessing')
        }
    },

    replyButtonProcessing: {
        receive: (bot, message) => message.payload
    },

    site: {
        prompt: (bot) => {
            return bot.say(states.site.prompt)
                .then( () => bot.say('%[Notre site](url)') )
        },
        receive: () => 'start'
    },

    sessionStart: {
        prompt: (bot) => {
            return bot.say(states.sessionStart.prompt)
                .then( () => bot.say('%[Migration](reply:migration) %[Creation](reply:creation)') )
        },
        receive: () => 'replyButtonProcessing'
    },

    creation: {
        prompt: (bot) => {
            return bot.say(states.creation.prompt)
                .then( () => 'booking')
        },
        receive: () => 'start'
    },

    booking: {
        prompt: (bot) => {
            return bot.say(states.booking.prompt)
                .then( () => 'start')
        },
        receive : () => 'start'
    },

    migration: {
        prompt: (bot) => {
            return bot.say(states.migration.prompt)
        },
        receive: () => 'builtWithStart'
    },

    builtWithStart: {
        prompt: (bot) => {
            return bot.say("Je vais proceder a une petite analyse ...")
                .then( () => 'builtWithResults' )
        },
        receive: () => 'builtWithStart'
    },

    builtWithResults: {

        prompt: (bot) => {
            return bot.say("Voici les caracteristiques que j'ai pu observer avec mon cyber scanner.")
        },
        receive: () => 'start'
    }

});
