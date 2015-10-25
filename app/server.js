var Path, Config, postal, Express, ExpressSession, ExpressBodyParser, Mongoose, Passport, GithubStrategy, User, Logger, fork, server;

//Node Modules
Path = require('path');
Config = require('./config.js');

//Express dependencies
Express = require('express');
ExpressSession = require('express-session');
ExpressBodyParser = require('body-parser');

//DB dependencies
Mongoose = require('mongoose');

//Passport Dependencies
Passport = require('passport');
GithubStrategy = require('passport-github').Strategy;
User = require('./model/User');
Logger = require("./logger.js");

fork = require('child_process').fork;
postal = require('postal');


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

Logger.log('debug',"Loading routes");

//Session Routes
server.get(Config.path + '/session', EnsureAuthentication, require('./routes/Session'));
server.get(Config.path + '/login/github', require('./routes/login/github/Entry'));
server.get(Config.path + '/login/github/callback', Passport.authenticate('github'), require('./routes/login/github/Callback'));
server.get(Config.path + '/logout', require('./routes/Logout'));

//Users
server.get(Config.path + '/users/:username', require('./routes/User'));
server.put(Config.path + '/users/:username', EnsureAuthentication, require('./routes/UserUpdate'));

//Agents
server.get(Config.path + '/users/:username/agents', require('./routes/user/AgentList'));
server.get(Config.path + '/users/:username/agents/:id', EnsureAuthentication, require('./routes/user/AgentDetail'));
server.get(Config.path + '/users/:username/agents/:id/versions/', EnsureAuthentication, require('./routes/user/AgentVersionList'));

server.get(Config.path + '/users/:username/agents/:id/versions/:versionId', EnsureAuthentication, require('./routes/user/AgentVersionDetail'));
server.put(Config.path + '/users/:username/agents/:id', EnsureAuthentication, require('./routes/user/AgentUpdate'));
server.post(Config.path + '/users/:username/agents', EnsureAuthentication, require('./routes/user/AgentNew'));

//Battle
server.post(Config.path + '/battle/', EnsureAuthentication, require('./routes/battle/Queue'));
server.get(Config.path + '/battle/', require('./routes/battle/List'));
server.get(Config.path + '/battle/:id/', require('./routes/battle/Detail'));
server.get(Config.path + '/battle/:id/chunk/:chunkId', require('./routes/battle/Chunk'));

//Start Queue Runner

var fs = require('fs'),
	out = fs.openSync('./out.log', 'a'),
	err = fs.openSync('./out.log', 'a');

var debug = typeof v8debug === 'object';
if (debug) {
	var DEBUG_PORT = 50000;
	Logger.log('debug',"Process is being debugged. Opening debug in QueueRunner. Port "+DEBUG_PORT );
	process.execArgv.push('--debug=' + (DEBUG_PORT ));
}

Logger.log('debug',"Starting QueueRunner" );
var queueRunner = fork('app/engine/QueueRunner', [], {
	stdio: ['ignore', out, err]
});


postal.subscribe({
	channel: "models",
	topic: "battle.save",
	callback: function (model) {
		Logger.log('info',"New battle detected. Sending a message to QueueRunner" );
		queueRunner.send({
			name: "RUN",
			data: model._id
		})
	}
});


//Start listening!



server.listen(Config.http.port, Config.http.ip, function (error) {
	if (error) {
		throw error;
	}

	Logger.log('info',"API Listening on " + Config.http.ip + ":" + Config.http.port );
});
