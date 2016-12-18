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

class SuperStateMachine extends StateMachine {

}

module.exports.SuperSmoochApiBot = SuperSmoochApiBotTwo
module.exports.SuperStateMachine = SuperStateMachine

