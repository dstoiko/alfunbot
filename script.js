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
                .then( () => bot.say('%[Oui](reply:sessionStart) %[Non](reply:site)') )
                .then( () => 'replyButtonProcessing')
        }
    },

    replyButtonProcessing: {
        receive: (bot, message) => {
            bot.getProp('siteType').then( result => console.log(result) )
            return message.payload
        }
    },

    site: {
        prompt: (bot) => {
            return bot.say(states.site.prompt)
                .then( () => bot.say('%[Notre site](https://google.com)') )
        },

        receive: (bot) => {
            return 'start'
        }
    },

    sessionStart: {
        prompt: (bot) => {
            return bot.say(states.sessionStart.prompt)
                .then( () => bot.say('%[Migration](reply:migration) %[Creation](reply:creation)') )
        },
        receive: (bot, message) => {
                return  message.payload
        }
    },

    creation: {
        prompt: (bot) => {
            return bot.say(states.creation.prompt)
                .then( () => 'booking')
        },
        receive: (bot) => 'start'
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
            return bot.sayCarousel([{title: "Tacos", description: "Some description", mediaUrl: "http://example.org/image.jpg"}])
                .then( () => 'builtWithResults' )
                .catch( err => bot.say(err) )
        },
        receive: (bot) => {
            return 'builtWithStart'
        }
    },

    builtWithResults: {

        prompt: (bot) => {
            return bot.say("Voici les caracteristiques que j'ai pu observer avec mon cyber scanner.")
        },

        receive: (bot) => { return 'start' }
    }

});
