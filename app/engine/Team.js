"use strict";
var Vector2D,Point2D,Entity;


Vector2D = require("./vendor/Vector2D");
Point2D = require("./vendor/Point2D");
Entity = require("./Unit");

/**
 * Representa un equipo
 * @param {string} _name Nombre del equipo
 * @constructor Crear un equipo con las caracteristicas especificadas
 */
function Team(_name) {

    /**
     * Indica si el equipo entero sigue vivo
     * @type {boolean}
     */
    this.alive = true;

    /**
     * Nombre del equipo
     * @type {string}
     */
    this.name = (_name && _name.trim()) || "Guest";

    /**
     * Unidades del equipo
     * @type {Unit[]}
     */
    this.units = {};



}

/**
 * Añade una unidad al equipo
 * @param {Unit} _unit
 */
Team.prototype.addUnit=function(_unit){
  this.units.push(_unit);
};






/**
 * GETTERS && SETTERS
 */


/**
 * Devuelve si el equipo sobrevive o no
 * @returns True si está vivo, false si no
 */
Team.prototype.isAlive = function () {
    return this.alive;
};

/**
 * Permite establecer si el equipo sobrevive o no
 * @param _alive
 */
Team.prototype.setAlive = function(_alive){
    this.alive = _alive;
};

/**
 * Devuelve el nombre del equipo
 * @returns {String} Nombre del equipo
 */
Team.prototype.getName = function () {
    return this.name;
};

/**
 * Devulve un tanque por su identificador
 * @param Identificador
 * @returns Tanque
 */
Team.prototype.Unit = function (id) {
    return this.tanks[id];
};

module.exports = Team;
