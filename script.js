'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({

    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    // Initial state of the bot
    start: {
        receive: (bot) => {
            return bot.say(`Bienvenue sur Wondor !`)
                .then(() => 'welcome');
        }
    },

    welcome: {
        prompt: (bot) => bot.say(`Nous offrons actuellement des services de bricolage, déménagement et ménage. Sélectionnez une option pour commencer : %[Demander un service](postback:pass) %[Plus d'infos](postback:faq)`),
        receive: () => 'escape'
    },

    // Password entry for beta test users
    pass: {
        prompt: (bot) => bot.say(`Dites le mot de passe...`),
        receive: (bot, message) => {
            const pass = message.text.trim().toLowerCase();
            if (pass === 'wondorisback') {
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
            if (pass === 'wondorisback') {
                return bot.say(`Gagné !`)
                    .then(() => 'postcode');;
            }
            else {
                return bot.say(`Toujours pas le bon mot de passe... %[Demander un accès](http://goo.gl/forms/YjYcGDHIzcohI7Az1) %[Réessayer](postback:passRetry)`);
            }
        }
    },

    // Postcode and date/time entry
    postcode: {
        prompt: (bot) => bot.say(`Quel est votre code postal ?`),
        receive: (bot, message) => {
            const postcode = message.text.trim();
            return bot.setProp('postcode', postcode)
                .then(() => 'date')
        }
    },
    date: {
        prompt: (bot) => bot.say(`Pour quand voulez-vous demander un service ? (date et heure)`),
        receive: (bot, message) => {
            const date = message.text.trim();
            return bot.setProp('date', date)
                .then(() => 'email')
        }
    },
    // Collect user e-mail
    email: {
        prompt: (bot) => bot.say(`Quelle est votre adresse e-mail ? Nous utiliserons cette adresse pour vous envoyer une offre de prestation.`),
        receive: (bot, message) => {
            const email = message.text.trim();
            return bot.setProp('email', email)
                .then(() => 'servicesRequest')
        }
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
        prompt: (bot) => bot.say(`De quel service de bricolage avez-vous besoin ?
        %[Montage de meubles](postback:furniture)
        %[Pose au mur](postback:mounting)
        %[Peinture](postback:paint)
        %[Autre](postback:otherBrico)`),
        receive: () => 'escape'
    },
    furniture: {
        prompt: (bot) => bot.say(`Pourriez-vous préciser le nombre et type(s) de meubles à monter ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot, message) => {
            const ask = message.text.trim();
            return bot.setProp('ask', ask)
                .then(() => 'wait')
        }
    },
    mounting: {
        prompt: (bot) => bot.say(`Pourriez-vous préciser ce que vous avez besoin de fixer (étagères, luminaires, rideaux...) ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot, message) => {
            const ask = message.text.trim();
            return bot.setProp('ask', ask)
                .then(() => 'wait')
        }
    },
    paint: {
        prompt: (bot) => bot.say(`Pourriez-vous préciser quelle surface vous avez besoin de peindre ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot, message) => {
            const ask = message.text.trim();
            return bot.setProp('ask', ask)
                .then(() => 'wait')
        }
    },
    otherBrico: {
        prompt: (bot) => bot.say(`Pourriez-vous décrire votre besoin de bricolage ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot, message) => {
            const ask = message.text.trim();
            return bot.setProp('ask', ask)
                .then(() => 'wait')
        }
    },
    menage: {
        prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin de ménage : surface, fenêtres à nettoyer, vêtements à repasser ? Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service.`),
        receive: (bot, message) => {
            const ask = message.text.trim();
            return bot.setProp('ask', ask)
                .then(() => 'menageProducts')
        }
    },
    menageProducts: {
        prompt: (bot) => bot.say(`Avez-vous besoin de produits d'entretien ?`),
        receive: (bot, message) => {
            const products = message.text.trim();
            return bot.setProp('produits', products)
                .then(() => 'wait')
        }
    },
    // demenagement: {
    //     prompt: (bot) => bot.say(`Décrivez en quelques mots votre besoin : surface de votre appartement, nombre de cartons, mobilier encombrant... Soyez bref mais précis, ce message sera utilisé pour sélectionner une personne qualifiée pour ce service !`),
    //     receive: (bot) => {
    //         const ask = message.text.trim();
    //         return bot.setProp('ask', ask)
    //             .then(() => 'human')
    //     }
    // },
    demenagement: {
        prompt: (bot) => bot.say(`Où emménagez-vous ? (code postal de destination)`),
        receive: (bot, message) => {
            const destination = message.text.trim();
            return bot.setProp('destination', destination)
                .then(() => 'demenagementType')
        }
    },
    demenagementType: {
        prompt: (bot) => bot.say(`De quel service de déménagement avez-vous besoin ?
        %[Transport seul](postback:transportOnly)
        %[Transport avec aide](postback:transportHelp)`),
        receive: () => 'escape'
    },
    transportOnly: {
        prompt: (bot) => bot.say(`Le transport seul comprend un service de déménagement de trottoir à trottoir, avec chargement et déchargement de 15mn maximum. Combien de cartons avez-vous à déplacer environ ?`),
        receive: (bot, message) => {
            const type = bot.getState();
            const boxes = message.text.trim();
            return bot.setProp('cartons', boxes)
                .then(bot.setProp('type', type))
                .then(() => 'bigFurniture')
        }
    },
    transportHelp: {
        prompt: (bot) => bot.say(`Le transport avec aide comprend une intervention avec un chauffeur éventuellement accompagné pour vous aider à transporter vos biens. Combien de cartons avez-vous à déplacer environ ?`),
        receive: (bot, message) => {
            const type = bot.getState();
            const boxes = message.text.trim();
            return bot.setProp('cartons', boxes)
                .then(bot.setProp('type', type))
                .then(() => 'bigFurniture')
        }
    },
    bigFurniture: {
        prompt: (bot) => bot.say(`Avez-vous également des gros meubles à transporter ? Si oui, dites simplement combien et quels types de meubles...`),
        receive: (bot, message) => {
            const bigItems = message.text.trim();
            if (bot.getProp('type') == 'transportHelp') {
                return bot.setProp('gros', bigItems)
                    .then(() => 'etageA')
            }
            else if (bot.getProp('type') == 'transportOnly') {
                return bot.setProp('gros', bigItems)
                    .then(() => 'wait')
            }

        }
    },
    etageA: {
        prompt: (bot) => bot.say(`A quel étage habitez-vous ? Indiquez également si vous avez un ascenseur dans votre bâtiment actuel.`),
        receive: (bot, message) => {
            const etageA = message.text.trim();
            return bot.setProp('etageA', etageA)
                .then(() => 'etageB')
        }
    },
    etageB: {
        prompt: (bot) => bot.say(`A quel étage emménagez-vous ? Indiquez également si vous avez un ascenseur dans votre prochain bâtiment.`),
        receive: (bot, message) => {
            const etageB = message.text.trim();
            return bot.setProp('etageB', etageB)
                .then(() => 'wait')
        }
    },

    otherService: {
        prompt: (bot) => bot.say(`De quel service auriez-vous besoin ? Dites-nous ce que nous devrions ajouter à notre offre !`),
        receive: (bot, message) => {
            const autreService = message.text.trim();
            return bot.setProp('autreService', autreService)
                .then(bot.say(`Merci pour votre demande. Nous la prenons en compte et essayons d'élargir notre offre au plus vite ! Vous voulez recevoir une notification quand ce service est disponible ? %[Me notifier](http://eepurl.com/b9RLAP)`))
                .then(() => 'human')
        }
    },

    // FAQ to answer most common questions
    faq: {
        prompt: (bot) => {
            return bot.say(`Voici les questions qu'on nous pose souvent :
%[Quand lancez-vous ?](postback:launchDate)
%[Où ?](postback:citiesAvailable)
%[Quels services ?](postback:servicesAvailable)`)
            .then(() => bot.say(`%[Qui est wondor ?](postback:wondorsProfile)
%[Quels prix ?](postback:howMuch)
%[Devenir wondor](postback:workRequest)`))
        },
        receive: () => 'escape'
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
        prompt: (bot) => bot.say(`Vous pouvez demander n’importe quel service via notre plateforme. Actuellement, nous travaillons avec des bricoleurs, déménageurs et agents de ménage. Mais nous lancerons prochainement d’autres services. Demandez naturellement un service dont vous auriez besoin, nous ferons au mieux pour l’inclure au plus vite selon la demande ! %[Demander un autre service](postback:otherService)`),
        receive: () => 'contactRequest'
    },
    wondorsProfile: {
        prompt: (bot) => bot.say(`Tous les wondors sont des prestataires de services qualifiés sur leur domaine et dont l’identité a été vérifiée.`),
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

    // Waiting message
    wait: {
        prompt: (bot) => {
            return bot.say(`Nous revenons vers vous au plus vite avec un tarif estimatif ou une demande de précisions...`)
                .then(() => 'human')
        },
        receive: () => 'human'
    },

    // Fallback for human to jump in the conversation
    escape: {
        prompt: (bot) => bot.say(`Sélectionnez l'une des options proposées dans le dernier message, nous traiterons votre demande au plus vite ! Voulez-vous parler à quelqu'un de notre équipe ?
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
