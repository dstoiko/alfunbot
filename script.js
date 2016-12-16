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
        receive: (bot, message) => {
            return bot.say(states.start.response)
                .then(() => {
                    console.log("Payload" + message.payload)
                    bot.say('%[Oui](reply:sessionStart) %[Non](reply:site)')
                })
        }
    },

    site: {
        prompt: (bot) => {
            return bot.say(states.site.prompt)
                .then( () => bot.say('%[Notre site](url)') )
        },

        receive: (bot) => {
            return 'start'
        }

    },

    sessionStart: {
        prompt: (bot) => {
            return bot.say(states.sessionStart.prompt)
                .then( () => bot.say('%[Migration](reply:migration) %[Creation](reply:creation)') )
        }
    },

    creation: {
        prompt: (bot) => {
            return bot.say(states.creation.prompt)
                .then( () => 'booking')
        }
    },

    booking: {
        prompt: (bot) => {
            return bot.say(states.booking.prompt)
                .then( () => 'start')
        }
    },

    migration: {
        prompt: (bot) => {
            return bot.say(states.migration.prompt)
        },
        receive: (bot) => {
            return 'builtWithStart'
        }
    },

    builtWithStart: {
        prompt: (bot) => {
            return bot.say("Je vais proceder a une petite analyse ...")
                .then( () => 'builtWithResults' )
        }
    },

    builtWithResults: {

        prompt: (bot) => {
            return bot.say("Voici les caracteristiques que j'ai pu observer avec mon cyber scanner.")
        },

        receive: (bot) => { return 'start' }
    }

});
