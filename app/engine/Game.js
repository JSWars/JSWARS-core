"use strict";
var _,Team,GridMap;



_ = require("underscore");
Team = require("./Team");
GridMap = require("./GridMap");

/**
 * Representa un juego
 * @param {GridMap} _map Mapa sobre el que se va a presentar el juego
 * @param {Object} _teamPrototypes Prototipos para los equipos
 * @constructor
 */
function Game(_map, _teamPrototypes) {
    //Checks
    if (!_map instanceof GridMap) {
        throw "El parámetro 'map' debe ser un objeto válido 'Map'.";
    }

    this.map = _map;
    this.teams = {};

    //Add teams to current game based on prototypes
    for (var i = 0; i < _teamPrototypes.length; i+=1) {
        var team = _teamPrototypes[i];
        this.teams[i] = new Team(team.name, team.tanks);
    }

}

Game.prototype.render=function(){
    this.map.render();

};

/**
 * GETTERS & SETTERS
 */

/**
 * Devuelve el mapa que se está usando en el juego
 * @returns {Map} Mapa
 */
Game.prototype.getMap = function () {
    return this.map;
};

/**
 * Devuelve el equipo especificado por su identificador
 * @param {number} Identificador
 * @returns {Team} Equipo
 */
Game.prototype.getTeam = function (id) {
    return this.teams[id];
};



module.exports = Game;
