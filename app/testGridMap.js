"use strict";
var GridMap,Game,Runner,Team,Unit, _,readline, PF, Path,Vector2D,Angle,Agent,AgentController;

GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");
Team = require("./engine/Team");
Unit=require("./engine/Unit");
Vector2D=require("./engine/vendor/Vector2D");
Angle=require("./engine/vendor/Angle");

Agent=require("./engine/Agent");

AgentController=require('./engine/controllers/AgentController');

_=require("underscore");
readline = require('readline');
PF=require("pathfinding");


// Inicializamos el juego
var game = new Game();

game.addTeam("Luis");


var properties={
	position:new Vector2D(3,3)//OBLIGATORIO
};
game.teams[0].addUnit(new Unit(game,game.teams[0],properties));

game.addTeam("Marcos");

var properties={
	position:new Vector2D(3,12)//OBLIGATORIO
};
game.teams[1].addUnit(new Unit(game,game.teams[1],properties));


//todo fix ruta
game.addAgent(new AgentController("./agents/AgentMierder.js"));
game.addAgent(new AgentController("./agents/AgentMierder.js"));

game.initialize();




for(var i=0;i<800;i+=1){
    game.tick();
}


console.log(JSON.stringify(game.chunk));
