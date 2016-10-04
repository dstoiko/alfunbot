'use strict';

const Script = require('smooch-bot').Script;

// Natural language processing module
const natural = require('natural');
// For e-mail validation
const validator = require('validator');


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
        prompt: (bot) => bot.say(`Nous offrons actuellement des services de maison récurrents (ménage, repassage, ...) et des services à la carte (bricolage, accueil AirBnB, course express, pressing, ...). Sélectionnez une option pour commencer : %[Demander un service](postback:pass) %[Plus d'infos](postback:faq)`),
        receive: () => 'escape'
    },

    // Password entry for beta test users
    pass: {
        prompt: (bot) => bot.say(`Dites le mot de passe...`),
        receive: (bot, message) => {
            const pass = message.text.trim().toLowerCase();
            if (pass === 'wondorbong') {
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
            if (pass === 'wondorbong') {
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
            // const date = moment(message.text.trim()).locale("fr").format('lll'); // Parse and sanitize date for future use MOMENT NOT WORKING, TRY ANOTHER ONE
            const date = message.text.trim();
            return bot.setProp('date', date)
                .then(() => 'email')
        }
    },
    // Collect user e-mail
    email: {
        prompt: (bot) => bot.say(`Quelle est votre adresse e-mail ? Nous utiliserons cette adresse plus tard pour vous envoyer une offre de prestation.`),
        receive: (bot, message) => {
            const email = message.text.trim();
            if (validator.isEmail(email)) { // Validate e-mail format using nifty validator library
                return bot.say(`Merci !`)
                    .then((bot) => bot.setProp('email', email))
                    .then(() => 'servicesRequest');
            }
            else {
                return bot.say(`Humm... Il semblerait que vous n'ayez pas rentré un e-mail valide... %[Réessayer](postback:emailRetry)`);
            }
        }
    },
    // Email retry if unsuccessful
    emailRetry: {
        prompt: (bot) => bot.say(`Veuilez réécrire votre adresse e-mail`),
        receive: (bot, message) => {
            const email = message.text.trim();
            if (validator.isEmail(email)) { // Validate e-mail format using nifty validator library
                return bot.say(`Merci !`)
                    .then((bot) => bot.setProp('email', email))
                    .then(() => 'servicesRequest');
            }
            else {
                return bot.say(`Il semblerait que vous n'ayez toujours pas rentré un e-mail valide...
                %[Réessayer](postback:emailRetry)
                %[Contacter l'équipe](postback:contactRequest)`);
            }
        }
    },

    // User chooses between available services or suggests a new one
    servicesRequest: {
        prompt: (bot) => bot.say(`Choisissez le type de service que vous voulez:
        %[Ménage](http://wondor.co/#services)
        %[Service à la carte](postback:alacarte)`),
        receive: () => 'escape'
    },

    // A la carte services
    alacarte: {
        prompt: (bot) => {
          return bot.say(`De quel service avez-vous besoin ?
          %[Accueil location](postback:renting)
          %[Bricolage](postback:bricolage)
          %[Pressing](postback:laundry)`)
              .then(() => bot.say(`%[Course express](postback:shopping)
              %[Cordonnier](postback:shoemaker)
              %[Courrier - Colis](postback:postoffice)`))
        },
        receive: () => 'escape'
    },

    // Specific messages for renting
    renting: {
      prompt: (bot) => bot.say(`Pourriez-vous préciser si vous souhaitez un service de check-in, check-out, un ménage ?`),
      receive: (bot, message) => {
          const ask = message.text.trim();
          return bot.setProp('ask', ask)
              .then(() => 'wait')
      }
    },

    laundry: {
      prompt: (bot) => bot.say(`Pourriez-vous préciser si vous souhaitez que l'on récupère vos vêtements chez vous ou au pressing ?`),
      receive: (bot, message) => {
          const ask = message.text.trim();
          return bot.setProp('ask', ask)
              .then(() => 'wait')
      }
    },

    shopping: {
      prompt: (bot) => bot.say(`Pourriez-vous préciser votre liste de courses à faire ?`),
      receive: (bot, message) => {
          const ask = message.text.trim();
          return bot.setProp('ask', ask)
              .then(() => 'wait')
      }
    },

    shoemaker: {
      prompt: (bot) => bot.say(`Pourriez-vous préciser si vous souhaitez que l'on récupère vos chaussures ou autres articles chez vous ou chez le cordonnier ?`),
      receive: (bot, message) => {
          const ask = message.text.trim();
          return bot.setProp('ask', ask)
              .then(() => 'wait')
      }
    },

    postoffice: {
      prompt: (bot) => bot.say(`Pourriez-vous préciser combien de colis vous souhaitez que l'on apporte à la poste ?`),
      receive: (bot, message) => {
          const ask = message.text.trim();
          return bot.setProp('ask', ask)
              .then(() => 'wait')
      }
    },

    // Specific messages for handywork
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

    otherService: {
        prompt: (bot) => bot.say(`De quel service auriez-vous besoin ?`),
        receive: (bot, message) => {
            const ask = message.text.trim();
            return bot.setProp('ask', ask)
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
        prompt: (bot) => bot.say(`Nous sommes en phase de test et nous lançons nos services courant octobre. Si vous voulez être parmi les premiers à découvrir wondor, cliquez sur ce lien : %[Me prévenir](http://eepurl.com/b9RLAP)`),
        receive: () => 'contactRequest'
    },
    citiesAvailable: {
        prompt: (bot) => bot.say(`Nous lançons le service pour Paris dans un premier temps. Si vous habitez dans une autre région, inscrivez-vous pour être prévenu de notre lancement chez vous : %[Me prévenir](http://eepurl.com/b_jwMv)`),
        receive: () => 'contactRequest'
    },
    servicesAvailable: {
        prompt: (bot) => bot.say(`Vous pouvez demander n’importe quel service via notre plateforme. Demandez naturellement un service dont vous auriez besoin, nous ferons au mieux pour l’inclure au plus vite selon la demande ! %[Demander un autre service](postback:otherService)`),
        receive: () => 'contactRequest'
    },
    wondorsProfile: {
        prompt: (bot) => bot.say(`Tous les wondors sont des prestataires de services qualifiés sur leur domaine, rencontrés en personne et dont l’identité a été vérifiée.`),
        receive: () => 'contactRequest'
    },
    howMuch: {
        prompt: (bot) => bot.say(`Nos tarifs sont évalués selon un taux horaire, avec une majoration pour certaines prestations complémentaires. Dans tous les cas, nous vous communiquons un estimatif dès que vous effectuez une demande via wondor !`),
        receive: () => 'contactRequest'
    },
    workRequest: {
        prompt: (bot) => bot.say(`Si vous êtes qualifié(e) sur l’un des services que nous proposons, vous pouvez travailler avec nous ! C’est très simple, remplissez l'un de ces formulaires et nous reviendrons vers vous très vite : %[Bricolage](https://goo.gl/forms/M1DkhFAJIcc4cc1H3) %[Ménage](https://goo.gl/forms/qlcRkjy7d9qVAf7G3) %[Autre]()`),
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
            return bot.say(`Veuillez patienter, nous revenons vers vous au plus vite avec un tarif estimatif ou une demande de précisions... %[Récapitulatif](postback:summary)`)
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
