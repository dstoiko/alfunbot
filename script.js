'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({

    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    // Initial state of the bot
    start: {
        receive: () => {
            return bot.say(`Bienvenue sur Wondor ! Nous offrons actuellement des services de bricolage, déménagement et ménage. Sélectionnez une option pour commencer : %[Demander un service](postback:pass) %[Autre demande](postback:faq) %[Visiter notre site](http://wondor.co)`);
        }
    },

    // Password entry for beta test users
    pass: {
        prompt: (bot) => bot.say(`Dites le mot de passe...`),
        receive: (bot, message) => {
            const pass = message.text.trim().toLowerCase();
            if (pass === 'wondorland') {
                return bot.say(`Gagné !`)
                    .then(() => 'postcode');
            }
            else {
                return bot.say(`Désolé, ce n'est pas le bon mot de passe... %[Demander un accès](http://goo.gl/forms/YjYcGDHIzcohI7Az1) %[Réessayer](postback:passRetry)`);
            }
        }
    },
    // Password retry if unsuccessful
    passRetry: {
        prompt: (bot) => bot.say(`Réssayez le mot de passe...`),
        receive: (bot, message) => {
            const pass = message.text.trim().toLowerCase();
            if (pass === 'wondorland') {
                return bot.say(`Gagné !`)
                    .then(() => 'postcode');;
            }
            else {
                return bot.say(`Toujours pas le bon mot de passe... %[Demander un accès](http://goo.gl/forms/YjYcGDHIzcohI7Az1) %[Réessayer](postback:passRetry)`);
            }
        }
    },

    // Post code and date/time entry (always go one after the other)
    postcode: {
        prompt: (bot) => bot.say(`Quel est votre code postal ?`),
        receive: () => 'date'
    },
    date: {
        prompt: (bot) => bot.say(`Pour quand voulez-vous demander un service (date et heure) ?`),
        receive: () => 'servicesRequest'
    },

    // User chooses between available services or suggests a new one
    servicesRequest: {
        prompt: (bot) => bot.say(`Choisissez le type de service que vous voulez:
%[Bricolage](postback:bricolage)
%[Ménage](postback:menage)
%[Déménagement](postback:demenagement)
%[Autre](postback:otherService)`),
        receive: () => 'escape'
    },

    // Specific message depending on service asked
    bricolage: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin de bricolage : petits travaux, peinture, autre ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot) => {
            return bot.say(`Merci, votre demande est bien prise en compte. Nous revenons vers vous au plus vite avec un tarif estimatif ou une demande de précisions complémentaires...`)
                .then(() => 'human')
        }
    },
    menage: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin de ménage : nombre de pièces, fenêtres à nettoyer, repassage ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot) => {
            return bot.say(`Merci, votre demande est bien prise en compte. Nous revenons vers vous au plus vite avec un tarif estimatif ou une demande de précisions complémentaires...`)
                .then(() => 'human')
        }
    },
    demenagement: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin : taille de votre appartement, nombre de cartons, mobilier encombrant... Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service !`),
        receive: (bot) => {
            return bot.say(`Merci, votre demande est bien prise en compte. Nous revenons vers vous au plus vite avec un tarif estimatif ou une demande de précisions complémentaires...`)
                .then(() => 'human')
        }
    },
    otherService: {
        prompt: (bot) => bot.say(`De quel service auriez-vous besoin ? Dites-nous ce que nous devrions ajouter à notre offre !`),
        receive: (bot) => {
            return bot.say(`Merci pour votre demande. Nous la prenons en compte et essayons d'élargir notre offre au plus vite ! Vous voulez recevoir une notification quand ce service est disponible ? %[Me notifier](http://eepurl.com/b9RLAP)`)
                .then(() => 'human')
        }
    },

    // FAQ to answer most common questions
    faq: {
        prompt: (bot) => {
            return bot.say(`Voici les questions qu'on nous pose souvent :
%[Quand lancez-vous wondor ?](postback:launchDate)
%[Dans quelles villes ?](postback:citiesAvailable)
%[Quels services ?](postback:servicesAvailable)
%[Qui offre ses services ?](postback:wondorsProfile)
%[Combien ça coûte ?](postback:howMuch)
%[Comment travailler avec wondor ?](postback:workRequest)`)
            .then(() => bot.say(`Besoin de plus d'infos ?
%[Visiter notre site](http://wondor.co)`))
        },
        receive: () => 'contactRequest'
    },
    launchDate: {
        prompt: (bot) => bot.say(`Nous sommes en phase de test privé cet été et nous lançons nos services courant septembre. Si vous voulez être parmi les premiers à découvrir wondor, cliquez sur ce lien : %[Me prévenir](http://eepurl.com/b9RLAP)`),
        receive: () => 'contactRequest'
    },
    citiesAvailable: {
        prompt: (bot) => bot.say(`Nous lançons le service pour Paris et l’Ile-de-France dans un premier temps. Si vous habitez dans une autre région, inscrivez-vous pour être prévenu de notre lancement chez vous : %[Me prévenir](http://eepurl.com/b_jwMv)`),
        receive: () => 'contactRequest'
    },
    servicesAvailable: {
        prompt: (bot) => bot.say(`Vous pouvez demander n’importe quel service via notre plateforme. Actuellement, nous travaillons avec des bricoleurs, déménageurs et agents de ménage. Mais nous lancerons très prochainement d’autres services. Demandez naturellement un service dont vous auriez besoin, nous ferons au mieux pour l’inclure au plus vite selon la demande ! %[Demander un autre service](postback:otherService)`),
        receive: () => 'contactRequest'
    },
    wondorsProfile: {
        prompt: (bot) => bot.say(`Tous les wondors sont des prestataires de services qualifiés, que nous avons rencontrés en personne et dont l’identité a été vérifiée.`),
        receive: () => 'contactRequest'
    },
    howMuch: {
        prompt: (bot) => bot.say(`Nos tarifs sont évalués selon un taux horaire pour le bricolage et le ménage (majoration pour certaines prestations complémentaires), et une grille tarifaire selon le volume à transporter, la distance et les étages pour le déménagement. Dans tous les cas, nous vous communiquons un estimatif dès que vous effectuez une demande via wondor !`),
        receive: () => 'contactRequest'
    },
    workRequest: {
        prompt: (bot) => bot.say(`Si vous êtes qualifié(e) sur l’un des services que nous proposons, vous pouvez travailler avec nous ! C’est très simple, remplissez l'un de ces formulaires et nous reviendrons vers vous très vite : %[Bricolage](https://goo.gl/forms/M1DkhFAJIcc4cc1H3) %[Déménagement](https://goo.gl/forms/ErBYXvtfQ6qJm9b42) %[Ménage](https://goo.gl/forms/qlcRkjy7d9qVAf7G3)`),
        receive: () => 'contactRequest'
    },
    // If FAQ doesn't answer all the user's questions
    contactRequest: {
        prompt: (bot) => bot.say(`Veuillez patienter, un de mes collègues humains va prendre le relais...`)
            .then(() => 'human'),
        receive: () => 'human'
    },

    // Fallback for human to jump in the conversation
    escape: {
        prompt: (bot) => bot.say(`Sélectionnez l'une des options proposées dans le dernier message, nous traiterons votre demande au plus vite ! Voulez-vous parler à notre équipe ?
%[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'contactRequest'
    },
    human: {
        receive: () => 'human'
    },

    // Error handling
    error: {
        prompt: (bot) => bot.say(`Beep Boop... Désolé, il y a une erreur...
%[Parler à l'équipe](postback:contactRequest)`),
        receive: () => 'escape'
    }
});
