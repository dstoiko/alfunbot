'use strict';

const smoochBot     = require('smooch-bot');
const SmoochApiBot  = smoochBot.SmoochApiBot
// const StateMachine  = smoochBot.StateMachine;

class SuperSmoochApiBot extends SmoochApiBot {

    constructor(options) {
        super(options);
        
        this.name = options.name;
        this.avatarUrl = options.avatarUrl;
    }

    sayCarousel(items) {

        const api = this.store.getApi();
        // let message = {
        //     role: 'appMaker',
        //     type: 'carousel',
        //     items: items
        // }
        let message = Object.assign({
            role: 'appMaker',
            type: 'carousel',
            items: items
        }, {
            name: this.name,
            avatarUrl: this.avatarUrl
        });
        console.log(message)
        return api.appUsers.sendMessage(this.userId, message)
            .then(data => console.log(data))
            .catch(e => console.log(e.message))
    }
}

module.exports.SuperSmoochApiBot = SuperSmoochApiBot
// module.exports.SuperStateMachine = SuperStateMachine
