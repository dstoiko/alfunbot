'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({

    start: {
        receive: (bot) => {
            return bot.say(`Bienvenue sur Wondor ! Nous offrons actuellement des services de bricolage, déménagement et ménage. Sélectionnez 'Demander un service' pour continuer.
%[Demander un service](postback:postcode)
%[Autre demande](postback:contactRequest)
%[Visiter notre site](http://wondor.co)`);
        }
    },

    postcode: {
        prompt: (bot) => bot.say(`Quel est votre code postal ?`),
        receive: (bot, message) => {
            const postcode = message.text.trim();
            return bot.setProp('postcode', postcode)
                .then(() => 'date');
        }
    },

    date: {
        prompt: (bot) => bot.say(`Pour quand voulez-vous ce service (date et heure) ?`),
        receive: (bot, message) => {
            const date = message.text.trim();
            return bot.setProp('date', date)
                .then(() => 'servicesRequest');
        }
    },

    servicesRequest: {
        prompt: (bot) => bot.say(`Choisissez un type de service :
%[Bricolage](postback:bricolage)
%[Ménage](postback:menage)
%[Déménagement](postback:demenagement)`),
        receive: () => 'escape'
    },

    contactRequest: {
        prompt: (bot) => bot.say(`Veuillez patienter, un de mes collègues humains va prendre le relais...`)
            .then(() => 'human')
    },

    bricolage: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin de bricolage : petits travaux, peinture, autre ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot, message) => {
            return bot.say(`Merci, votre demande est prise en compte. Nous revenons vers vous tout de suite avec un prix estimatif...`)
                .then(() => 'human')
        }
    },

    menage: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin de ménage : nombre de pièces, fenêtres à nettoyer, repassage ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot, message) => {
            return bot.say(`Merci, votre demande est prise en compte. Nous revenons vers vous tout de suite avec un prix estimatif...`)
                .then(() => 'human')
        }
    },

    demenagement: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin : taille de votre appartement, nombre de cartons, mobilier encombrant... Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service !`),
        receive: (bot, message) => {
            return bot.say(`Merci, votre demande est prise en compte. Nous revenons vers vous tout de suite avec un prix estimatif...`)
                .then(() => 'human')
        }
    },

    human: {
        receive: () => 'human'
    },

    escape: {
        prompt: (bot) => bot.say(`Sélectionnez l'une des options proposées dans le dernier message, nous tratierons votre demande au plus vite ! Voulez-vous parler à notre équipe ?
%[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'contactRequest'
    },

    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    error: {
        prompt: (bot) => bot.say(`Beep Boop... Désolé, il y a une erreur...
%[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'escape'
    }
});
