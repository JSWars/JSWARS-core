"use strict";
var GridMap, Game, Runner, Team, Unit, _, readline, PF, Path, Vector2D, Angle, Agent, AgentController;

GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");
Team = require("./engine/Team");
Unit = require("./engine/Unit");
Vector2D = require("./engine/vendor/Vector2D");
Angle = require("./engine/vendor/Angle");

Agent = require("./engine/Agent");

AgentController = require('./engine/controllers/AgentController');

_ = require("underscore");
readline = require('readline');
PF = require("pathfinding");


// Inicializamos el juego
var game = new Game();

var luisTeamId = game.addTeam("Luis", new AgentController("./agents/AgentMierder.js"));
var marcosTeamId = game.addTeam("Marcos", new AgentController("./agents/AgentMierder.js"));

for (var o = 0; o < 5; o++) {
	game.teams[luisTeamId].addUnit(new Unit(game, game.teams[luisTeamId], {
		position: game.getRandomFreeCell() //Return a vector2d,
	}));
	game.teams[marcosTeamId].addUnit(new Unit(game, game.teams[marcosTeamId], {
		position: game.getRandomFreeCell() //Return a vector2d
	}));
}

//todo fix ruta

game.initialize();

for (var i = 0; i < 800; i += 1) {
	game.tick();
}


console.log(JSON.stringify(game.chunk));
