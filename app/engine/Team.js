"use strict";
/**
 * Created by JumpToFive.com
 * User: Luis Sebastián Huerta
 * Date: 12/10/13
 * Time: 17:20
 */

var Vector2D = require("../vendor/Vector2D"),
    Tank = require("./Tank");

/**
 * Representa un equipo
 * @param _name Nombre del equipo
 * @param _tankNumber Número de tanques
 * @constructor Crear un equipo con las caracteristicas especificadas
 */
function Team(_name, _tankNumber) {
    this.alive = 1;
    this.name = (_name && _name.trim()) || "Guest";
    this.tanks = {};

    for (var i = 0; i < _tankNumber; i++) {
        this.tanks[i] = new Entity(); //Rellenar parámetros
    }

}

/**
 * Devuelve si el equipo sobrevive o no
 * @returns True si está vivo, false si no
 */
Team.prototype.isAlive = function () {
    return this.alive;
}

/**
 * Permite establecer si el equipo sobrevive o no
 * @param _alive
 */
Team.prototype.setAlive = function(_alive){
    this.alive = _alive;
}

/**
 * Devuelve el nombre del equipo
 * @returns {String} Nombre del equipo
 */
Team.prototype.getName = function () {
    return this.name;
}

/**
 * Devulve un tanque por su identificador
 * @param Identificador
 * @returns Tanque
 */
Team.prototype.getTank = function (id) {
    return this.tanks[id];
}

module.exports = Team;
