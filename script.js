'use latest';

const Script = require('smooch-bot').Script;

// Natural language processing module
const natural = require('natural');
// For e-mail validation
const validator = require('validator');
// For external API requests
const request = require('request');
// For JSON filtering
const where = require('lodash.where');
// States stored locally
const states = require('./states');

const BUILTWITH_KEY = process.env['BUILTWITH_API_KEY'];

// Filters for parsing BuiltWith API response
let techFilter = function(technologies, tag) {
  if (where(technologies, { 'tag': tag }) !== undefined) {
    let results = where(technologies, { 'tag': tag });
    let string = '';
    results.forEach(function(result) {
      string += ', ' + result.Name;
    });
    console.log(string);
    return string + "\n";
  }
  else {
    return 'pas d\'information';
  }
}

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
          let siteUrl = message.text.trim();
          result = request(
            'https://api.builtwith.com/v11/api.json?KEY=' +
            BUILTWITH_KEY +
            '&LOOKUP=' +
            siteUrl,
            function (error, response, body) {
              if (!error && response.statusCode == 200) {
                let technologies = JSON.parse(body).Results[0].Result.Paths[0].Technologies;
                console.log(technologies);
                let cms = techFilter(technologies, 'cms');
                console.log(cms);
                let hosting = techFilter(technologies, 'hosting');
                console.log(hosting);
                let framework = techFilter(technologies, 'framework');
                console.log(framework);
                let out = 'CMS : ' + cms +
                          'Hébergement : ' + hosting +
                          'Langage(s) : ' + framework ;
              }
              else {
                let out = 'Je n\'ai pas trouvé votre profil technologique, toutes mes excuses...';
              }
              return out;
            }
          );
          return bot.say(states.migration.response + result);
              .then( () => 'builtWithStart' )
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
