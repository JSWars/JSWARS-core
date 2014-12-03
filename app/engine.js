"use strict";
var GridMap,Game,Runner;

GridMap = require("./engine/GridMap");
Game = require("./engine/Game");
Runner = require("./engine/Runner");

GLOBAL.config = require("./engine/Config");

//Crear mapa. Todo: Sacar desde fichero
var testMap = new GridMap("TestMap");
testMap.initializeColMap();

///Mockup data
var teamsPrototypes = [];
teamsPrototypes.push({name:"Marcx",entities:5});
teamsPrototypes.push({name:"Okami",entities:5});

var game = new Game(testMap,teamsPrototypes);



testMap.render();