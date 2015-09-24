var GridMap, Game, Runner, Team, Unit, FS, _, PF, Path, Vector2D, Angle, Agent, Map, Battle, BattleFrame, Config, Mongoose, readline;


//ENGINE
GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");
Team = require("./engine/Team");
Unit = require("./engine/Unit");
Vector2D = require("./engine/vendor/Vector2D");
Angle = require("./engine/vendor/Angle");
Agent = require("./engine/Agent");

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
		FS.readFile('./app/resources/maps/_default.json', 'utf8', function (err, mapData) {
			if (err) {
				console.log(err);
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
				console.log("map saved, creating");
				createGame();
			})
		})
	} else {
		console.log("map found, creating game");
		createGame();
	}
});

function createGame() {

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

		//TODO GENERAR LA PARTIDA DESDE UN SERVICIO PASANDO POR PARÁMETRO LOS AGENTES
		var luisTeamId = newGame.addTeam("55f1423a2d7abecc233aca51");
		var marcosTeamId = newGame.addTeam("55f1423a2d7abecc233aca51");


		//TODO PONER UNIDADES EN EL MAPA
		newGame.teams[luisTeamId].addUnit(new Unit(newGame, newGame.teams[luisTeamId], {
			position: new Vector2D(2, 2) //Return a vector2d,
		}));
		newGame.teams[marcosTeamId].addUnit(new Unit(newGame, newGame.teams[marcosTeamId], {
			position: new Vector2D(10, 2) //Return a vector2d
		}));

		//Set map
		newGame.setMap(map.data);
		newBattle.map = map._id;
		newBattle.chunkSize = 300;
		newBattle.fps = 60;
		newBattle.agents = [];

		for(var i in newGame.teams){
			newBattle.agents.push(newGame.teams[i].agent.id);
		}

		newBattle.save(function (err) {
			console.log(err);
		});

		//Run Game
		newGame.initialize()
			.then(function initializeResolved() {

				function tickCallback(i,frame){
					console.log("saving tick:" + i);
					var newBattleFrame = new BattleFrame({
						battle: newBattle._id,
						index: i,
						data: frame
					});



					newBattleFrame.save(function (err, response) {
						console.log(err);
					});
				}

				newGame.run(undefined,tickCallback,undefined);

			}, function initializeRejected() {
				console.log("Error al inicializar el juego");
			});

	});


}





