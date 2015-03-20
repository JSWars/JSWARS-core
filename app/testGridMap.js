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

game.teams[0].addDefaultUnit();

game.addTeam("Marcos");

game.teams[1].addDefaultUnit();


_.each(game.teams,function(_team){
    _.each(_team.units,function(_unit){
        var p=game.getRandomFreeCell();
        //var p = new Vector2D(15,13);
        _unit.moveTo(new Angle(0,true));
        _unit.addAttackOrder(new Angle(Math.PI/2,true));
        console.log("Pos: " + _unit.position);
        console.log("Dest: "+ _unit.moveTo[0]);
    });
});


for(var i=0;i<100;i+=1){
    game.tick();
    game.render();
}

console.log(JSON.stringify(game.chunk));