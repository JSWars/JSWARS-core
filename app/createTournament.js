var Map, Config, Mongoose, Tournament;

////MODEL
Map = require("./model/Map");
Tournament = require("./model/Tournament");
Config = require('./config.js');

//LIBS
Mongoose = require('mongoose');

//CONNECT TO DATABASE
Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: %s', err);
});


var printUsage = function () {
	console.log("Usage: node createTournament.js [rounds] \"[name}\"");
	process.exit(0);
};

if (process.argv[2] === undefined || process.argv[3] === undefined) {
	printUsage();
}

var roundsArg = parseInt(process.argv[2]);

var name = process.argv[3];

//FIRST LOAD MAP ON DB
Map.findOne({default: true})
	.lean(true)
	.then(function (map) {
		var tournamentEntity = new Tournament();
		tournamentEntity.name = name;
		tournamentEntity.map = map._id;
		tournamentEntity.rounds = roundsArg;
		tournamentEntity.fps = 60;
		tournamentEntity.moment = new Date();
		tournamentEntity.save(function (err) {
			if (err) {
				Logger.log('error', err);
			}
			console.log("Tournament created");
			Mongoose.connection.close()
		})


	});







