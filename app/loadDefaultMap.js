var GridMap, Game, Team, Unit, FS, Path, Vector2D, Angle, Agent, Map, Battle, BattleFrame, Config, Mongoose, Logger;

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

Logger = require('./logger.js');

//FIRST LOAD MAP ON DB
Map.findOne({default: true}, function (err, map) {
	if (err) {
		console.log(err);
		return;
	}

	if (map === null) {
		Logger.log('info', 'Map not found in DB');
		FS.readFile('.app/resources/maps/_default.json', 'utf8', function (err, mapData) {
			if (err) {
				Logger.log('error', 'Default map file can\'t not be loaded', err);
				return;
			}
			Logger.log('info', 'Default map file loaded');
			var mapEntity = new Map();
			mapEntity.name = "Default Map";
			mapEntity.default = true;
			mapEntity.data = JSON.parse(mapData);

			mapEntity.save(function (err, response) {
				if (err) {
					Logger.log('error', 'Default map can\'t be saved on database', err);
				} else {
					Logger.log('info', 'Default map loaded');
				}
			})
		})
	} else {
		Logger.log('warn', 'Default map already in database');
	}
});






