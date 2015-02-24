"use strict";
var GridMap,Game,Runner,Team,Unit,Point2D, _,readline, PF, Path,Vector2D;

GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");
Team = require("./engine/Team");
Unit=require("./engine/Unit");
Vector2D=require("./engine/vendor/Vector2D");
_=require("underscore");
readline = require('readline');
PF=require("pathfinding");






// Inicializamos el juego
var game = new Game();

game.addTeam("Luis");

game.teams[0].addDefaultUnit();

game.addTeam("Marcos");

game.teams[1].addDefaultUnit();


game.teams[0].units[0].addAttackOrder(game.teams[1].units[0]);
//_.each(game.teams,function(_team){
//    _.each(_team.units,function(_unit){
//        var p=game.getRandomFreeCell();
//        //var p = new Vector2D(15,13);
//        _unit.moveTo.push(p);
//        console.log("Pos: "+_unit.position);
//        console.log("Dest: "+_unit.moveTo[0]);
//
//
//    });
//});

game.map.checkObsFreeDistance(new Vector2D(2.5,2.5),new Vector2D(2.5,4.5),game.createDefaultUnit(),0.1);

for(var i=0;i<100;i+=1){
    game.tick();
    game.render();
}

//console.log(JSON.stringify(game.chunk));