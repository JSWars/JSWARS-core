var _, Map, Battle, BattleFrame, Mongoose, Game, Unit, Config, BattleQueue;

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

Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: %s', err);
});

var messageHandler = function (message) {
	if (message.name == "RUN") {
		var queueItemId = message.data;
		BattleQueue.findById(queueItemId, function (err, queueItem) {
			runBattleQueueItem(queueItem);
		})
	}
};


function runBattleQueueItem(battleQueueItem) {

	//Create battle
	var newBattle = new Battle();

	// Create Game
	var newGame = new Game();

	Map.findOne({default: true}, function (err, map) {
		if (err) {
			console.log(err);
			return;
		}
		//Create teams

		//Set map
		newGame.setMap(map.data);
		newBattle.map = map._id;
		newBattle.chunkSize = 300;
		newBattle.fps = 60;
		newBattle.agents = [];

		for (var i = 0; i < battleQueueItem.agents.length; i++) {
			var teamId = newGame.addTeam(battleQueueItem.agents[i]);
			newGame.teams[teamId].addUnit(new Unit(newGame, newGame.teams[teamId], {
				position: [2, 2] //Return a vector2d,
			}));
			newBattle.agents.push(newGame.teams[teamId].agent.id);

		}

		newBattle.save(function (err) {
			console.log(err);
		});

		//Run Game
		newGame.initialize()
			.then(function initializeResolved() {

				function beginCallback() {
					//TODO: CHANGE QUEUE ITEM STATUS

				}

				function tickCallback(i, frame) {
					console.log("Saving tick:" + i);
					var newBattleFrame = new BattleFrame({
						battle: newBattle._id,
						index: i,
						data: frame
					});

					newBattleFrame.save(function (err, response) {
						console.log('saving');
					});
				}

				function endCallback() {
					//TODO: REMOVE ITEM FROM QUEUE
				}

				newGame.run(beginCallback, tickCallback, endCallback);

			}, function initializeRejected() {

			});

	});
}

process.on('message', messageHandler);


//module.exports = Runner;
