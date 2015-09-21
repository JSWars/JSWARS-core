var GridMap, Game, Runner, Team, Unit, FS, _, PF, Path, Vector2D, Angle, Agent, AgentController, Map, Battle, BattleFrame, Config, Mongoose;


//ENGINE
GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");
Team = require("./engine/Team");
Unit = require("./engine/Unit");
Vector2D = require("./engine/vendor/Vector2D");
Angle = require("./engine/vendor/Angle");
Agent = require("./engine/Agent");
AgentController = require('./engine/controllers/AgentController');

//MODEL
Map = require("./model/Map");
Battle = require('./model/Battle');
BattleFrame = require('./model/BattleFrame');
Config = require('./config.js');

//LIBS
FS = require("fs");
_ = require("underscore");
readline = require('readline');
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

	console.log('Map found in DB', map);

	if (map === null) {
		console.log("Map not found in DB");
		FS.readFile('./resources/maps/_default.json', 'utf8', function (err, mapData) {
			if (err) {
				console.log(err);
			}
			console.log("Loading default map", mapData);
			var newMap = new Map();
			newMap.name = "Default Map";
			newMap.default = true;
			newMap.data = JSON.parse(mapData);

			newMap.save(function (err, response) {
				if (err) {
					console.log(err);
					return;
				}
				console.log("map saved, creating")
				createGame();
			})
		})
	} else {
		console.log("map found, creating game")
		createGame();
	}
});

function createGame() {

	//Create battle
	var newBattle = new Battle();

	// Create Game
	var game = new Game();

	Map.findOne({default: true}, function (err, map) {
		if (err) {
			console.log(err);
			return;
		}
		game.setMap(map.data);
		createTeams();
		runGame();
	});

	//Load map in game

	function createTeams() {
		var luisTeamId = game.addTeam("Luis", new AgentController("56004de6f595528b68c8e1f0"));
		var marcosTeamId = game.addTeam("Marcos", new AgentController("56004df1f595528b68c8e1f2"));

		game.teams[luisTeamId].addUnit(new Unit(game, game.teams[luisTeamId], {
			position: new Vector2D(2, 2) //Return a vector2d,
		}));
		game.teams[marcosTeamId].addUnit(new Unit(game, game.teams[marcosTeamId], {
			position: new Vector2D(10, 2) //Return a vector2d
		}));
	}

	function runGame() {
		game.initialize()
			.then(function initializeResolved() {


				newBattle.save(function (err) {
					console.log(err);
				});

				for (var i = 0; i < 800; i += 1) {
					var frame = game.tick();

					console.log("saving tick:" + i);
					var newBattleFriend = new BattleFrame({
						battle: newBattle._id,
						index: i,
						data: frame
					});

					newBattleFriend.save(function (err, response) {
						console.log(err)
					});
				}

				console.log(JSON.stringify(game.chunk));

			}, function initializeRejected() {

			});

	}


}




