"use strict";
var GridMap,Game,Runner,Team,Unit,Point2D, _,readline, PF;

GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");
Team = require("./engine/Team");
Point2D=require("./engine/vendor/Point2D");
Unit=require("./engine/Unit");
_=require("underscore");
readline = require('readline');
PF=require("pathfinding");



GLOBAL.config = require("./engine/Config");

//Crear mapa. Todo: Sacar desde fichero
var testMap = new GridMap("TestMap");
testMap.initializeColMap();
testMap.initializeGrid();



// Inicializamos el juego
var game = new Game(testMap);

//var path=testMap.getPath(game.getRandomFreeCell(),game.getRandomFreeCell());
//add team
game.addTeam("Luis");

game.teams[0].addUnit(game.createRandomUnit());

_.each(game.teams,function(_team){
    _.each(_team.units,function(_unit){
        var p=game.getRandomFreeCell();

        _unit.moveTo.push(p);
        console.log("Pos: "+_unit.position);
        console.log("Dest: "+_unit.moveTo[0]);


    });
});




    var r1 =readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });

    r1.on("line",function(){
        game.tick();
        game.render();


    })