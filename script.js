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
function techFilter(technologies, tag) {
  if (where(technologies, { 'Tag': tag }) !== null) {
    var results = where(technologies, { 'Tag': tag });
    var array = [];
    results.forEach(function(result) {
      array.push(result.Name);
    });
    var string = array.join(', ');
    return string;
  }
  else {
    return 'pas d\'information';
  }
}

function handleReplyButton(message) {
  if (message.payload) {
    return  message.payload
  }
  else {
    return 'escape'
  }
}

module.exports = new Script({

    processing: {
        receive: () => 'processing'
    },

    back: {
        prompt: (bot) => {
          return bot.say(states.back.prompt)
              .then(() => 'start')
        },
        receive: () => 'start'
    },

    start: {
        receive: (bot) => {
            return bot.say(states.start.response)
                .then( () => 'replyButtonProcessing')
        }
    },

    replyButtonProcessing: {
        receive: (bot, message) => {
            return message.payload
        }
    },

    site: {
        prompt: (bot) => bot.say(states.site.prompt),
        receive: () => 'escape'
    },

    sessionStart: {
        prompt: (bot) => bot.say(states.sessionStart.prompt),
        receive: (bot, message) => {
            return handleReplyButton(message)
        }
    },

    creation: {
        prompt: (bot) => {
            return bot.say(states.creation.prompt)
                .then( () => 'booking')
        },
        receive: (bot, message) => {
            if (message.payload) {
                return  message.payload
            }
            else {
                return 'escape'
            }
        }
    },

    booking: {
        prompt: (bot) => bot.say(states.booking.prompt),
        receive: (bot, message) => {
            let email = message.text.trim();
            if (validator.isEmail(email)) {
                return bot.say(states.booking.response)
                    .then(() => bot.setProp('email', email))
                    .then(() => 'menu')
            }
            else {
                return bot.say(states.booking.error)
                    .then(() => 'deadend')
            }
        }
    },

    migration: {
        prompt: (bot) => {
            return bot.say(states.migration.prompt)
        },
        receive: (bot, message) => {
          var siteUrl = message.text.trim();
          if (!(validator.isURL(siteUrl))) {
            return bot.say(states.migration.noURL)
                .then(() => 'escape');
          }
          else {
            return bot.say(states.migration.wait)
            .then(() => {
              return new Promise((resolve) => {
                request(
                  'https://api.builtwith.com/v11/api.json?KEY=' +
                  BUILTWITH_KEY +
                  '&LOOKUP=' +
                  siteUrl,
                  function (error, response, body) {
                    var out = '';
                    if (!error && response.statusCode == 200) {
                      var technologies = JSON.parse(body).Results[0].Result.Paths[0].Technologies;
                      var cms = techFilter(technologies, 'cms');
                      var hosting = techFilter(technologies, 'hosting');
                      var framework = techFilter(technologies, 'framework');
                      var string = 'CMS : ' + cms + '\n' +
                            'Hébergement : ' + hosting + '\n' +
                            'Langage(s) : ' + framework ;
                      out = states.migration.response + string;
                    }
                    else {
                      out = 'Je n\'ai pas trouvé votre profil technologique, toutes mes excuses...';
                    }
                  resolve(bot.say(out));
                });
              });
            })
              .then(() => 'builtWithResults')
          }
        }
    },

    builtWithResults: {
        prompt: (bot) => {
            return bot.say(states.builtWithResults.check)
        },
        receive: (bot, message) => {
            reply = message.payload
            if (reply === 'yes') {
                return bot.say(states.builtWithResults.yes)
                    .then(() => 'offers')
            }
            if (reply === 'no') {
                return bot.say(states.builtWithResults.no)
                    .then(() => 'contact')
            }
            else {
                return 'escape'
            }
        }
    },

    offers: {
        prompt: (bot) => {
            return bot.say(states.offers.prompt)
                .then(() => bot.say(states.offers.carousel))
        },
        receive: () => 'escape'
    },

    contact: {
        prompt: (bot) => {
            if (bot.getProp('email')) {
                return bot.say(states.contact.exists)
                    .then(() => bot.getProp('email'))
                    .then((email) => bot.say(`Vous serez contacté(e) sur ${email}, cela vous convient-il ?`))
                    .then(() => bot.say(states.contact.check))
            }
            else {
                return bot.say(states.contact.prompt);
            }
        },
        receive: (bot, message) => {
            return bot.getProp('email')
                .then((email) => {
                    if (email !== '') {
                        if (message.payload === 'yes') {
                            return bot.say(states.contact.response)
                                .then(() => 'escape')
                        }
                        else if (message.payload === 'contact') {
                            let reset = '';
                            return bot.setProp('email', reset)
                                .then(() => message.payload)
                        }
                        else {
                            return 'escape'
                        }
                    }
                    else {
                        let email = message.text.trim();
                        if (validator.isEmail(email)) {
                            return bot.say(states.contact.response)
                                .then(() => bot.setProp('email', email))
                                .then(() => 'menu')
                        }
                        else {
                            return bot.say(states.contact.error)
                                .then(() => 'deadend')
                        }
                    }
                })
        }
    },

    menu: {
        prompt: (bot) => bot.say(states.menu.prompt),
        receive: () => 'deadend'
    },

    escape: {
        prompt: (bot) => bot.say(states.escape.prompt),
        receive: () => 'deadend'
    },

    deadend: {
        receive: (bot) => {
            return bot.say(states.deadend.response)
                .then(() => 'deadend')
        }
    }

});
