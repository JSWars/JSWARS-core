var Path, Config, Express, ExpressSession, ExpressBodyParser, Mongoose, Passport, GithubStrategy, User, conn, server;

//Node Modules
Path = require('path');
Config = require('./config.js');

//Express dependencies
Express = require('express');
ExpressSession = require('express-session');
ExpressBodyParser = require('body-parser');

//Mongo dependencies
Mongoose = require('mongoose');

//Passport Dependencies
Passport = require('Passport');
GithubStrategy = require('Passport-github').Strategy;
User = require('./model/User');


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

// serialize and deserialize
Passport.serializeUser(function (user, done) {
    done(null, user);
});
Passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// config
Passport.use(new GithubStrategy(Config.apis.github,
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

//---------------------------
//        FILTERS
//---------------------------
var EnsureAuthentication = require('./filters/EnsureAuthenticated');

//---------------------------
//          ROUTES
//---------------------------

//Session Routes
server.get(Config.path + '/session', EnsureAuthentication, require('./routes/Session'));
server.get(Config.path + '/login/github', require('./routes/login/github/Entry'));
server.get(Config.path + '/login/github/callback', Passport.authenticate('github'), require('./routes/login/github/Callback'));
server.get(Config.path + '/logout', require('./routes/Logout'));

//Data Routes
server.get(Config.path + '/users/:username', require('./routes/User'));


//Start listening!

server.listen(Config.http.port, Config.http.ip, function (error) {
    if (error) {
        return console.log(error);
        throw error;
    }

    console.info("Listen=> " + Config.http.ip + ":" + Config.http.port);
});

