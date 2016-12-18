'use strict';

const smoochBot     = require('smooch-bot');
const SmoochApiBot  = smoochBot.SmoochApiBot
const StateMachine  = smoochBot.StateMachine;

class SuperSmoochApiBotTwo extends SmoochApiBot {

    say(text, options) {
        const api = this.store.getApi();
        let message = Object.assign({
            text,
            actions: options.actions,
            role: 'appMaker'
        }, {
            name: this.name,
            avatarUrl: this.avatarUrl,
            items: options.items,
            type: options.type

        });
        console.log(message)
        return api.appUsers.sendMessage(this.userId, message);
    }
}

module.exports.SuperSmoochApiBot = SuperSmoochApiBotTwo

// StateMachine.receiveMessage = function(message) {

//     console.log(message);

//     if (message.text === 'lol') {
//       var last = this.bot.getProp('last');
//       console.log('last: '+last);
//       var state = this.getState();
//       console.log('state: '+state);
//       if(state === 'human' && Date.now() > last + 1000) {
//         return Promise.all([
//             this.bot.releaseLock(),
//             this.setState('start')
//         ]);
//       }
//     }

//     if (message.text === 'reset') {
//         return Promise.all([
//             this.bot.releaseLock(),
//             this.setState('start')
//         ]);
//     }

//     return Promise.all([
//         this.getState(),
//         this.bot.acquireLock()
//     ])
//         .then((results) => {
//             const state = results[0];
//             const lock = results[1];

//             if (!lock) {
//                 return this.prompt('processing');
//             }

//             return this.transition(message, state);
//         })
//         .then(() => this.bot.releaseLock())
//         .catch((err) => {
//             this.bot.releaseLock();
//             this.prompt('error');
//             throw err;
//         });
// }

// module.exports.StateMachine = StateMachine;
