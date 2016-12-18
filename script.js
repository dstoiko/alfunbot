'use latest';

const Script = require('smooch-bot').Script;

// Natural language processing module
const natural = require('natural');
// For e-mail validation
const validator = require('validator');
// For external API requests
const request = require('request');
// States stored locally
const states = require('./states');

const BUILTWITH_KEY = process.env['BUILTWITH_API_KEY'];

module.exports = new Script({

    processing: {
        receive: () => 'processing'
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
            return message.payload
        }
    },

    site: {
        prompt: (bot) => {
            return bot.say(states.site.prompt)
                .then( () => bot.say('%[Notre site](https://google.com)') )
        },
        receive: () => 'start'
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
        receive: (bot, message) =>  {
          let siteUrl = message.text.trim;
          request(
            'https://api.builtwith.com/v11/api.json?KEY=' +
            BUILTWITH_KEY +
            '&LOOKUP=' +
            siteUrl,
            function (error, response, body) {
              if (!error && response.statusCode == 200) {
                console.log(JSON.stringify(body, null, 2));
              }
            }
          );
          return 'builtWithStart'
        }
    },

    builtWithStart: {
        prompt: (bot) => {
            return bot.say(states.builtWithStart.prompt)
                .then( () => 'builtWithResults' )
        },
        receive: () => 'builtWithStart'
    },

    builtWithResults: {
        prompt: (bot) => {
            return bot.say(states.builtWithResults.prompt)
        },
        receive: () => 'start'
    }

});
