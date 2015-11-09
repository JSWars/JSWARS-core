var _, Map, Battle, BattleFrame, Mongoose, Game, Unit, Config, BattleQueue, Logger;

Config = require('../config');
_ = require("underscore");
Mongoose = require("mongoose");

BattleQueue = require("../model/BattleQueue");
Game = require("./Game");
Unit = require("./Unit");

//MODEL
Map = require("../model/Map");
Battle = require('../model/Battle');
BattleFrame = require('../model/BattleFrame');


Logger = require('../logger.js');

Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: %s', err);
});

var messageHandler = function (message) {
	if (message.name === "RUN") {
		var queueItemId = message.data;
		BattleQueue.findById(queueItemId, function (err, queueItem) {
			runBattleQueueItem(queueItem);
		});
	}
};


function runBattleQueueItem(battleQueueItem) {

	//Create battle
	var newBattle = new Battle();

	// Create Game
	var newGame = new Game();

	Map.findOne({default: true}, function (err, map) {
		if (err) {
			Logger.log('error', 'Can\'t find default map to run the battle', err);
			return;
		}
		//Create teams

		Logger.log('debug', 'Creating a game instance');

		newGame.setMap(map.data);
		newBattle.map = map._id;
		newBattle.chunkSize = 300;
		newBattle.fps = 60;
		newBattle.agents = [];

		for (var i = 0; i < battleQueueItem.agents.length; i++) {
			var team = newGame.addTeam(battleQueueItem.agents[i]);
			for (var o = 0; o < battleQueueItem.units; o++) {
				team.addUnit(new Unit(newGame, team, {
					position: [2 + o * 8, 2] //Return a vector2d,
				}));
			}

			newBattle.agents.push(team.agent.id);
		}

		newBattle.save(function (err) {
			if (err) {
				Logger.log('error', 'New battle can\'t be saved');
			}
			Logger.log('info', 'Battle saved');
		});

		//Run Game
		Logger.log('debug', 'Initializing game');
		newGame.initialize()
			.then(function initializeResolved() {

				function beginCallback() {
					console.log("Start battle run");
				}

				function tickCallback(i, frame) {
					var newBattleFrame = new BattleFrame({
						battle: newBattle._id,
						index: i,
						data: frame
					});

					newBattleFrame.save(function (err, response) {
					});
				}

				function endCallback() {
					console.log("End battle run");
				}

				newGame.run(beginCallback, tickCallback, endCallback);

			}, function initializeRejected() {

			});

	});
}

process.on('message', messageHandler);


//module.exports = Runner;
