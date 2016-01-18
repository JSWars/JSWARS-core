//Node and Util Modules
var Path = require('path');
var Config = require('./config.js');
var Logger = require("./logger.js");

var fork = require('child_process').fork;
var postal = require('postal');

//Express dependencies
var Express = require('express');
var ExpressSession = require('express-session');
var ExpressBodyParser = require('body-parser');

//DB dependencies
var Mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(ExpressSession);

//Passport Dependencies
var Passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

//Model
var User = require('./model/User');


//Connect to Mongo
Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (error) {
	Logger.log('error', 'Error connecting to database', error)
});

server = Express();

server.use(ExpressBodyParser.json()); // get information from html forms
server.use(ExpressBodyParser.urlencoded({extended: true}));
server.use(ExpressSession({
	resave: true,
	saveUninitialized: true,
	secret: 'a6277604a',
	store: new MongoStore({mongoose_connection: Mongoose.connection})
}));
server.use(Passport.initialize());
server.use(Passport.session()); // persistent login sessions

//Serializador de usuario
Passport.serializeUser(function (user, done) {
	done(null, user);
});
//Deserializador de usuario
Passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

// Configurando la estrategia de login de GitHUB
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

Logger.log('debug', "Loading filters");

var EnsureAuthentication = require('./filters/EnsureAuthenticated');

//---------------------------
//          ROUTES
//---------------------------

Logger.log('debug', "Loading routes");

//Session Routes
server.get(Config.path + '/status', require('./routes/Status'));
server.get(Config.path + '/session', EnsureAuthentication, require('./routes/Session'));
server.get(Config.path + '/login/github', require('./routes/login/github/Entry'));
server.get(Config.path + '/login/github/callback', Passport.authenticate('github'), require('./routes/login/github/Callback'));
server.get(Config.path + '/logout', require('./routes/Logout'));

//Users
server.get(Config.path + '/users/:username', require('./routes/User'));
server.get(Config.path + '/users/', require('./routes/user/UserList'));
server.put(Config.path + '/users/:username', EnsureAuthentication, require('./routes/UserUpdate'));

//Agents
server.get(Config.path + '/users/:username/agents', require('./routes/user/AgentList'));
server.get(Config.path + '/users/:username/agents/:id', EnsureAuthentication, require('./routes/user/AgentDetail'));
server.get(Config.path + '/users/:username/agents/:id/versions/', EnsureAuthentication, require('./routes/user/AgentVersionList'));

server.get(Config.path + '/users/:username/agents/:id/versions/:versionId', EnsureAuthentication, require('./routes/user/AgentVersionDetail'));
server.put(Config.path + '/users/:username/agents/:id', EnsureAuthentication, require('./routes/user/AgentUpdate'));
server.post(Config.path + '/users/:username/agents', EnsureAuthentication, require('./routes/user/AgentNew'));

server.get(Config.path + '/battle/queue/:id/', EnsureAuthentication, require('./routes/battle/QueueGet'));

//Battle
server.post(Config.path + '/battle/', EnsureAuthentication, require('./routes/battle/Queue'));
server.get(Config.path + '/battle/', require('./routes/battle/BattleList'));
server.get(Config.path + '/battle/:id/', require('./routes/battle/Detail'));
server.get(Config.path + '/battle/:id/chunk/:chunkId', require('./routes/battle/Chunk'));
server.get(Config.path + '/battle/:id/dump', require('./routes/battle/Dump'));


var debug = typeof v8debug === 'object';
if (debug) {
	var DEBUG_PORT = 50000;
	Logger.log('debug', "Process is being debugged. Opening debug in QueueRunner. Port " + DEBUG_PORT);
	process.execArgv.push('--debug=' + (DEBUG_PORT ));
}

//Start Queue Runner
Logger.log('debug', "Starting QueueRunner");
var queueRunner = fork('app/engine/QueueRunner', [], {});

//Subscribe QueueRunner to DB updates
postal.subscribe({
	channel: "models",
	topic: "battle.save",
	callback: function (model) {
		Logger.log('info', "New battle detected. Sending a message to QueueRunner");
		queueRunner.send({
			name: "RUN",
			data: model._id.toString()
		});
	}
});

queueRunner.on('message', function (message) {
	switch (message.name) {
		case 'ENDED':
			postal.publish({
				channel: "queue",
				topic: "battle.ended." + message.data,
				data: undefined
			});
			break;
		case 'ERROR':
			postal.publish({
				channel: "queue",
				topic: "battle.error." + message.data,
				data: undefined
			});
			break;
	}
});

//Start listening API endpoints
server.listen(Config.http.port, Config.http.ip, function (error) {
	if (error) {
		Logger.log('info', "API can\'t be started", error);
	}

	Logger.log('info', "API Listening on " + Config.http.ip + ":" + Config.http.port);
});
