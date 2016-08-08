'use strict';

// Environment and utilities for node.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Initialize Firebase
const firebase = require('firebase');
firebase.initializeApp({
  serviceAccount: "../firebase-service.json",
  databaseURL: "https://wondorbot.firebaseio.com"
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index', {
        appToken: process.env.SMOOCH_APP_TOKEN
    });
});

module.exports = app;
