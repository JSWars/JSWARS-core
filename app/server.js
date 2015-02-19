var Path, Config, Express, ExpressSession, ExpressBodyParser, Mongoose, Passport, GithubStrategy, conn, server;

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
server.get(Config.path + '/session', EnsureAuthentication, require('./routes/Session'));


server.get(Config.path + '/', function (req, res) {
    console.log("homepage", req.user)
});
server.get(Config.path + '/login/github',
    Passport.authenticate('github'),
    function (req, res) {
    });
server.get(Config.path + '/login/github/callback',
    Passport.authenticate('github', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect(Config.path + '/session');
    });
server.get(Config.path + '/logout', function (req, res) {
    console.log("logout");
    req.logout();
    res.redirect('/');
});


//Start listening!

server.listen(Config.http.port, Config.http.ip, function (error) {
    if (error) {
        return console.log(error);
        throw error;
    }

    console.info("Listen=> " + Config.http.ip + ":" + Config.http.port);
});

