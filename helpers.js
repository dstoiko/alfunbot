'use strict';

const smoochBot     = require('smooch-bot');
const SmoochApiBot  = smoochBot.SmoochApiBot
const StateMachine  = smoochBot.StateMachine;

class SuperSmoochApiBotTwo extends SmoochApiBot {

    sayCarousel(items) {

        const api = this.store.getApi();
        let message = {
            role: 'appMaker',
            type: 'carousel',
            items: items
        }
        return api.appUsers.sendMessage(this.userId, message);
    }
}

class SuperStateMachine extends StateMachine {

}

module.exports.SuperSmoochApiBot = SuperSmoochApiBotTwo
module.exports.SuperStateMachine = SuperStateMachine

