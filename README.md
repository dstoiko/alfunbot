# AlfunBot

A Facebook Messenger chatbot based on [smoochbot](https://github.com/alavers/smooch-bot).

Built on Node.js with the Express web server framework, in the ES6 JavaScript standard, hosted on [heroku](https://heroku.com).

## Setup

`git clone` this repo and `cd` into it.

Run `npm install` to setup all the dependencies into the project.

## Running

`heroku run local` allows you to test the bot in a browser window, based on the latest version of the `heroku master` branch.

## Developing

Here are all the important files in the project:

`./heroku/index.js` --> the brain behind the bot, calling the right dependencies from the `smooch-bot` npm package and generating state machines, bots and handling messages/postbacks from the API endpoint.

`script.js` --> the conversational decision tree, defining the business logic of the bot.

`states.json` --> the messages sent by the bot to the user based on the decision tree.

`superSmoochApiBot.js` --> an `extend` class of `SmoochApiBot`, the `smooch-bot` message handling API. Allowing Facebook carousel messages to be built into the script of the bot seamlessly.

`helpers.js` --> an object of helper functions for the script.

### TODO

- Integrate DB connection with the bot (eg. Firebase/MongoDB) to retrieve user and conversation data
- Integrate bot analytics tools (eg. botanalytics, dashbot)
- Refactor BuiltWith API calling code out of the script (got `UnhandledPromiseRejection` errors when doing that at the moment)
