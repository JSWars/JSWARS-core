/* eslint-env node */
"use strict";

var Config, Path, Express, ExpressSession, ExpressBodyParser, Mongoose, Passport, GoogleStrategy, conn, server;

//Node Modules
Path = require('path')
Express = require('express');
ExpressSession = require('express-session');
ExpressBodyParser = require('body-parser');
Mongoose = require('mongoose');
Passport = require('passport');

//App Modules
Config = require('./config');

Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: %s', err);
});

//conn = Mongoose.createConnection(Config.db.url);
server = Express();

server.use(ExpressBodyParser.json()); // get information from html forms
server.use(ExpressBodyParser.urlencoded({extended: true}));
server.use(ExpressSession({resave: true, saveUninitialized: true, secret: 'a6277604a'}))
server.use(Passport.initialize());
server.use(Passport.session()); // persistent login sessions
server.use('/', Express.static(Path.join(__dirname, '/static')));


Passport.use(require('./auth/BasicStrategy'));

server.post('/login',
    Passport.authenticate('local'),
    function (req, res) {
        res.json(req.user);
    });

server.post('/signup', require("./routes/signup"));

server.listen(Config.http.port, Config.http.ip, function (error) {
    if (error) {
        throw error;
    }
    return console.log(error);
});
