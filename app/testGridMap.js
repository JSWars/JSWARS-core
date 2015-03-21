"use strict";
var GridMap,Game,Runner,Team,Unit, _,readline, PF, Path,Vector2D,Angle;

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


// Inicializamos el juego
var game = new Game();

game.addTeam("Luis");


var properties={
	position:new Vector2D(3,3),//OBLIGATORIO
	radius:0.5,
	speed:0.1,
	armor:0,
	damage:1,
	fireRate:10,
	fireDistance:5
};
game.teams[0].addUnit(new Unit(game,this,properties));

game.addTeam("Marcos");


var properties={
	position:new Vector2D(3,12),//OBLIGATORIO
	radius:0.5,
	speed:0.1,
	armor:0,
	damage:1,
	fireRate:10,
	fireDistance:5
};
game.teams[1].addUnit(new Unit(game,this,properties));



_.each(game.teams,function(_team){
    _.each(_team.units,function(_unit){
        var p=game.getRandomFreeCell();
        //var p = new Vector2D(15,13);
        _unit.moveTo(new Angle(Math.PI,true));
        _unit.addAttackOrder(new Angle(Math.PI/2,true));
    });
});


for(var i=0;i<100;i+=1){
    game.tick();
    //game.render();
}


console.log(JSON.stringify(game.chunk));
