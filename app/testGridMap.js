"use strict";
var GridMap,Game,Runner,Team,Unit, _,readline, PF, Path,Vector2D,Angle,Agent;

GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");
Team = require("./engine/Team");
Unit=require("./engine/Unit");
Vector2D=require("./engine/vendor/Vector2D");
Angle=require("./engine/vendor/Angle");

_=require("underscore");
readline = require('readline');
PF=require("pathfinding");
Agent=require("./engine/Agent");


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

game.addAgent(new Agent(game,0));
game.addAgent(new Agent(game,1));

game.initialize();




for(var i=0;i<800;i+=1){
    game.tick();
    //game.render();
}


console.log(JSON.stringify(game.chunk));
