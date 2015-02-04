"use strict";
var GridMap,Game,Runner,Team,Unit,Point2D, _,readline, PF, Path;

GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");
Team = require("./engine/Team");
Point2D=require("./engine/vendor/Point2D");
Unit=require("./engine/Unit");
_=require("underscore");
readline = require('readline');
PF=require("pathfinding");





// Inicializamos el juego
var game = new Game();

game.addTeam("Luis");

game.teams[0].addUnit(game.createDefaultUnit());

_.each(game.teams,function(_team){
    _.each(_team.units,function(_unit){
        var p=game.getRandomFreeCell();

        _unit.moveTo.push(p);
        console.log("Pos: "+_unit.position);
        console.log("Dest: "+_unit.moveTo[0]);


    });
});




    game.tick();
    game.render();

game.tick();
game.render();

game.tick();
game.render();

game.tick();
game.render();