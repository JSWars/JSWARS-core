"use strict";
var _,Team,GridMap;


/**
 * Created by JumpToFive.com
 * User: Luis Sebastián Huerta
 * Date: 12/10/13
 * Time: 17:19
 */

_ = require("underscore");
Team = require("./Team");
GridMap = require("./GridMap");

/**
 * Representa un juego
 * @param {Map} _map Mapa sobre el que se va a presentar el juego
 * @param {Object} _teamPrototypes Prototipos para los equipos
 * @constructor
 */
function Game(_map, _teamPrototypes) {
    //Checks
    if (!_map instanceof Map) {
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
