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
// Helper functions used
const helpers = require('./helpers');

const BUILTWITH_KEY = process.env['BUILTWITH_API_KEY'];

module.exports = new Script({

    processing: {
        receive: () => 'processing'
    },

    back: {
          prompt: (bot) => bot.say(states.start.response),
          receive: (bot, message) => helpers.handleReplyButton(message)
    },

    start: {
        receive: (bot) => {
            return bot.say(states.start.response)
                .then(() => 'replyButtonProcessing')
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
        receive: (bot, message) => helpers.handleReplyButton(message)
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
          var protocol = 'http://';
          var checkUrl = validator.isURL(protocol + siteUrl) || validator.isURL(siteUrl);
          if (!checkUrl) {
            return bot.say(states.migration.noURL)
                .then(() => 'deadend')
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
                    let result;
                    if (!error && response.statusCode == 200) {
                      let technologies = JSON.parse(body).Results[0].Result.Paths[0].Technologies;
                      let tags = Object.keys(states.migration.tags);
                      let obj = {};
                      tags.forEach(function(tag) {
                        let tagSearch = helpers.techFilter(technologies, tag);
                        obj[tag] = tagSearch;
                      });
                      result = obj;
                    }
                    else {
                      result = states.migration.noResult;
                    }
                  // Wait a few seconds, the bot is "thinking"...
                  setTimeout(
                    () => {
                      resolve(result);
                    }, 3000);
                });
              });
            })
            .then((techProfile) => {
              if (typeof techProfile == 'object') {
                let finalObj = helpers.interpolateObject(states.migration.tags, techProfile);
                let techArray = [];
                for (var key in techProfile) {
                  if (techProfile[key] !== '') {
                    techArray.push(finalObj[key]);
                  }
                }
                techProfile = techArray.join('\n\n');
              }
              return bot.say(techProfile)
            })
            .then(() => 'builtWithResults')
          }
        }
    },

    builtWithResults: {
        prompt: (bot) => {
            return setTimeout(
              () => bot.say(states.builtWithResults.check),
              2000
            );
        },
        receive: (bot, message) => {
            reply = message.payload
            if (reply === 'yes') {
                return bot.say(states.builtWithResults.yes)
                    .then(() => 'audience')
            }
            else if (reply === 'no') {
                return bot.say(states.builtWithResults.no)
                    .then(() => 'contact')
            }
            else {
                return 'escape'
            }
        }
    },

    audience: {
        prompt: (bot) => bot.say(states.audience.prompt),
        receive: (bot, message) => {
            let numbers = /\d+/; // extract only numbers from string
            let visitors = message.text.trim().match(numbers).toString();
            if (validator.isNumeric(visitors)) {
                return bot.say(states.audience.response)
                    .then(() => bot.setProp('visitors', visitors))
                    .then(() => 'vms')
            }
            else {
                return bot.say(states.audience.error)
                    .then(() => 'deadend')
            }
        }
    },

    vms: {
        prompt: (bot) => bot.say(states.vms.prompt),
        receive: (bot, message) => {
            let numbers = /\d+/; // extract only numbers from string
            let vms = message.text.trim().match(numbers).toString();
            if (validator.isNumeric(vms)) {
                return bot.say(states.vms.response)
                    .then(() => bot.setProp('vms', vms))
                    .then(() => 'offers')
            }
            else {
                return bot.say(states.vms.error)
                    .then(() => 'deadend')
            }
        }
    },

    offers: {
        prompt: (bot) => {
            return new Promise((resolve) =>
              setTimeout(
                () => resolve(bot.say(states.offers.prompt)),
                2000
              )
            )
            .then(() => bot.getProp('vms'))
            .then((vms) => {
              let vmNumber = parseInt(vms);
              if (vmNumber < 30) {
                return bot.sayCarousel(states.offers.basic)
              }
              else if (vmNumber <= 50) {
                return bot.sayCarousel(states.offers.advanced)
              }
              else {
                return bot.sayCarousel(states.offers.premium)
              }
            })
            .then(() => bot.storeUser())
            .then(() => {
              setTimeout(
                () => bot.say(states.offers.contact),
                2000
              );
            })
        },
        receive: (bot, message) => {
            if (message.payload === 'yes') {
                return 'contact'
            }
            else if (message.payload === 'no') {
                return 'menu'
            }
            else {
                return 'escape'
            }
        }
    },

    contact: {
        prompt: (bot) => {
          return bot.getProp('email')
            .then((email) => {
              if (email) {
                return bot.getProp('email')
                  .then((email) => bot.say(`Vous serez contacté(e) sur ${email},
                  cela vous convient-il ?`))
                  .then(() => bot.say(states.contact.check))
              }
              else {
                return bot.say(states.contact.prompt);
              }
            })
        },
        receive: (bot, message) => {
            return bot.getProp('email')
                .then((email) => {
                    if (email) {
                        if (message.payload === 'yes') {
                            return bot.say(states.contact.response)
                                .then(() => 'escape')
                        }
                        else if (message.payload === 'no') {
                            let reset = '';
                            return bot.setProp('email', reset)
                                .then(() => 'contact')
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
