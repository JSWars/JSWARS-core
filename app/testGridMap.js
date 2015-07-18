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


var Battle=require('./model/Battle');
var BattleFrame=require('./model/BattleFrame');


var Config = require('./config.js');
var Mongoose = require('mongoose');

Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: %s', err);
});

//Creamos partida en mongo
var newBattle = new Battle();

// Inicializamos el juego
var game = new Game();


//MAP

var defaultMap={
	"height":30,
	"layers":[
		{
			"data":[20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 37, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 13, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 18],
			"height":30,
			"name":"GridMap",
			"opacity":1,
			"type":"tilelayer",
			"visible":true,
			"width":30,
			"x":0,
			"y":0
		}],
	"nextobjectid":1,
	"orientation":"orthogonal",
	"properties":
	{

	},
	"renderorder":"left-up",
	"tileheight":32,
	"tilesets":[
		{
			"firstgid":1,
			"image":"template7x7_0.png",
			"imageheight":224,
			"imagewidth":224,
			"margin":0,
			"name":"template7x7_0",
			"properties":
			{

			},
			"spacing":0,
			"tileheight":32,
			"tilewidth":32
		}],
	"tilewidth":32,
	"version":1,
	"width":30
};

game.setMap(defaultMap);

//TEAMS
var luisTeamId = game.addTeam("Luis", new AgentController("./agents/AgentDer.js"));
var marcosTeamId = game.addTeam("Marcos", new AgentController("./agents/AgentIzq.js"));

	game.teams[luisTeamId].addUnit(new Unit(game, game.teams[luisTeamId], {
		position: new Vector2D(2,2) //Return a vector2d,
	}));
	game.teams[marcosTeamId].addUnit(new Unit(game, game.teams[marcosTeamId], {
		position: new Vector2D(10,2) //Return a vector2d
	}));

//INICIALIZAMOS JUEGO
game.initialize();

for (var i = 0; i < 800; i += 1) {
	var frame=game.tick();

	newBattle.frames.push(new BattleFrame({
		battle:newBattle._id,
		index:i,
		data:frame
	}));
}

newBattle.save();

console.log(JSON.stringify(game.chunk));

Mongoose.connection.close();
