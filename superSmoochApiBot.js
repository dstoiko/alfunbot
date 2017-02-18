'use strict';

const smoochBot = require('smooch-bot');
const SmoochApiBot = smoochBot.SmoochApiBot;

class SuperSmoochApiBot extends SmoochApiBot {

    constructor(options) {
        super(options);

        this.name = options.name;
        this.avatarUrl = options.avatarUrl;
    }

    sayCarousel(items) {

        const api = this.store.getApi();
        let message = Object.assign({
            role: 'appMaker',
            type: 'carousel',
            items: items
        }, {
            name: this.name,
            avatarUrl: this.avatarUrl
        });
        return api.appUsers.sendMessage(this.userId, message);
    }

    storeUser() {

        const api = this.store.getApi();

        console.log(api.appUsers.get(this.userId).then((user) => JSON.stringify(user, null, 2)));
    }
}

module.exports = SuperSmoochApiBot;
