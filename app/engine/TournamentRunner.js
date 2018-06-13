var _, Map, TournamentRegistration, Tournament, Battle, BattleFrame, Mongoose, Game, Unit, Config, BattleQueue, Logger;

Config = require('../config');
Q = require('q');
_ = require("underscore");
Mongoose = require("mongoose");

BattleQueue = require("../model/BattleQueue");
Game = require("./Game");
Unit = require("./Unit");

//MODEL
Map = require("../model/Map");
Tournament = require('../model/Tournament');
TournamentRegistration = require('../model/TournamentRegistration');

Battle = require('../model/Battle');
BattleFrame = require('../model/BattleFrame');

Logger = require('../logger.js');

Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: %s', err);
});

var messageHandler = function (message) {
	if (message.name === "RUN") {
		var tournamentRegistration = message.data;

		var tournament;
		var tournamentRegistrations;

		var promises = [];

		promises.push(TournamentRegistration.find({tournament: tournamentRegistration.tournament})
			.lean()
			.then(function (registration) {
				tournamentRegistrations = registration;
			}));

		promises.push(Tournament.findById(tournamentRegistration.tournament)
			.then(function (found) {
				tournament = found;
			}));


		Q.allSettled(promises).then(function () {
			if (tournamentRegistrations.length >= Math.pow(2, tournament.rounds)) {
				runTournament(tournament, tournamentRegistrations);
			}
		});


	}
};


function battleOnPromise(map, fps, agents, units, tournament, round) {

	var deferred = Q.defer();
	//Create battle
	var battleEntity = new Battle();
	// Create Game
	var newGame = new Game();


	newGame.setMap(map.data);
	battleEntity.map = map._id;
	battleEntity.chunkSize = 300;
	battleEntity.fps = fps;
	battleEntity.agents = agents;
	battleEntity.moment = new Date();
	battleEntity.tournament = tournament._id;
	battleEntity.tournamentRound = round;

	for (var i = 0; i < agents.length; i++) {
		var team = newGame.addTeam(battleEntity.agents[i].toString());
		Logger.log('info', 'Counting units for team ' + team.id);
		for (var o = 0; o < units; o++) {
			Logger.log('info', 'Creating unit ' + o + ' for team ' + team.id);
			team.addUnit(new Unit(newGame, team, {
				position: [5 + o * 4, 2 + i * 25] //Return a vector2d,
			}));
		}
	}

	battleEntity.save(function (err) {
		if (err) {
			Logger.log('error', 'New battle can\'t be saved');
			return;
		}
		Logger.log('info', 'Battle saved');
	});

	//Run Game
	Logger.log('info', 'Initializing game');
	newGame.initialize()
		.then(function initializeResolved() {
			function startCallback() {
				battleEntity.set('status', 'RUNNING');
				battleEntity.save();
				Logger.log('info', '[Tournament] Battle started');
			}

			function tickCallback(i, frame) {
				var battleFrameEntity = new BattleFrame({
					battle: battleEntity._id,
					index: i,
					data: frame
				});

				battleFrameEntity.save(function (err, response) {
				});
			}

			function endCallback(gameResult, gameTicks) {

				battleEntity.set('duration', gameTicks / battleEntity.fps);
				battleEntity.set('status', 'ENDED');

				if (gameResult === -1) {
					deferred.reject(battleEntity);
					Logger.log('info', '[Tournament] Battle ends with timeout');
				} else {
					var winner = gameResult;

					battleEntity.winner = winner.agent.id;
					battleEntity.loosers = [];

					var battleAgents = battleEntity.get('agents');
					for (var i = 0; i < battleAgents.length; i++) {
						if (battleAgents[i].toString() != battleEntity.winner.toString()) {
							battleEntity.loosers.push(battleAgents[i]);
						}
					}

					Logger.log('info', '[Tournament] Battle ends with a winner team')
				}

				Logger.log('info', '[Tournament] Battle ended');

				battleEntity.save(function (err) {
					if (err) {
						Logger.log('error', '[Tournament] Can\'t create result entity');
						Logger.log('error', err);
					}
				});


			}


			deferred.resolve(battleEntity);

			newGame.run(startCallback, tickCallback, endCallback);

		}, function initializeRejected(errors) {

			Logger.log('error', '[Tournament] Unknown error during game initializing');
			battleEntity.status = 'ERROR';
			battleEntity.save(function (err) {
			});

		});

	return deferred.promise;

}

function runTournament(tournament, tournamentRegistrations) {

	tournament.status = 'RUNNING';
	tournament.save(function () {
	});

	Map.findOne({default: true}, function (err, map) {
		if (err) {
			Logger.log('error', '[Tournament] Can\'t find default map to run the battle', err);
			return;
		}

		if (map === null) {
			Logger.log('error', '[Tournament] No map found.');
			return;
		}

		//Create teams
		Logger.log('info', '[Tournament] Preparing...');


		var battlesPerRound = function (round) {
			return Math.pow(2, round - 1);
		};

		var allAgents = [];
		for (var i = 0; i < tournamentRegistrations.length; i++) {
			allAgents.push(tournamentRegistrations[i].agent);
		}


		var runRound = function (round, agents) {
			Logger.log('info', '[Tournament] Configuring round ' + round);
			var promises = [];
			var winnerAgents = [];
			var battleCount = battlesPerRound(round);
			for (var i = 1; i <= battleCount; i++) {
				promises.push(battleOnPromise(map, tournament.fps, [agents.pop(), agents.pop()], 6, tournament, round));
			}

			Q.allSettled(promises).then(function (battlesResolved) {
				console.log(battlesResolved);
				for (var i in battlesResolved) {
					winnerAgents.push(battlesResolved[i].value.get("winner"));
				}
				var nextRound = round - 1;
				if (nextRound > 0) {
					runRound(nextRound,winnerAgents);
				} else {
					Logger.log('info', '[Tournament] finished');
					tournament.status = 'ENDED';
					tournament.save(function () {
					})
				}
			}, function (err) {
				tournament.status = 'ERROR';
				tournament.save(function () {
				});
				Logger.log('error', '[Tournament] Execution cancelled');
				Logger.log('error', err);
			});
		};

		runRound(tournament.rounds, allAgents);
	});
}


process.on('message', messageHandler);


//module.exports = Runner;
