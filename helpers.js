'use strict';

const smoochBot = require('smooch-bot');
const StateMachine = smoochBot.StateMachine;

//
StateMachine.receiveMessage = function(message) {

    var last = this.bot.getProp('last');
    console.log('last: '+last);
    var state = this.getState();
    console.log('state: '+state);
    if(state === 'human' && Date.now() > last + 1000) {
      return Promise.all([
          this.bot.releaseLock(),
          this.setState('start')
      ]);
    }

    if (message.text === 'reset') {
        return Promise.all([
            this.bot.releaseLock(),
            this.setState('start')
        ]);
    }

    return Promise.all([
        this.getState(),
        this.bot.acquireLock()
    ])
        .then((results) => {
            const state = results[0];
            const lock = results[1];

            if (!lock) {
                return this.prompt('processing');
            }

            return this.transition(message, state);
        })
        .then(() => this.bot.releaseLock())
        .catch((err) => {
            this.bot.releaseLock();
            this.prompt('error');
            throw err;
        });
}

module.exports.StateMachine = StateMachine;
