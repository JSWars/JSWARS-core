var GridMap, Game, Team, Unit, FS, Path, Vector2D, Angle, Agent, Map, Battle, BattleFrame, Config, Mongoose;


//
////MODEL
Map = require("./model/Map");
Config = require('./config.js');

//LIBS
FS = require("fs");
PF = require("pathfinding");
Mongoose = require('mongoose');

//CONNECT TO DATABASE
Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: %s', err);
});

//FIRST LOAD MAP ON DB
Map.findOne({default: true}, function (err, map) {
	if (err) {
		console.log(err);
		return;
	}

	if (map === null) {
		console.log("Map not found in DB");
		FS.readFile('./resources/maps/_default.json', 'utf8', function (err, mapData) {
			if (err) {
				console.log(err);
				return;
			}
			console.log("Loading default map");
			var newMap = new Map();
			newMap.name = "Default Map";
			newMap.default = true;
			newMap.data = JSON.parse(mapData);

			newMap.save(function (err, response) {
				if (err) {
					console.log(err);
					return;
				}
				console.log("Default map loaded");
			})
		})
	} else {
		console.log("Default map already exist");
	}
});






