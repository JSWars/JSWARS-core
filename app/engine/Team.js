"use strict";
var Vector2D,Vector2D,Entity;


Vector2D = require("./vendor/Vector2D");
Vector2D = require("./vendor/Vector2D");
Entity = require("./Unit");


function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i+=1 ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


/**
 * Representa un equipo
 * @param {number} _id Identificador del equipo
 * @param {string} _name Nombre del equipo
 * @constructor Crear un equipo con las caracteristicas especificadas
 */
function Team(_id,_name,_game) {

    /**
     * Variable del juego
     *
     * Intance of the game
     */
    this.game=_game;


    /**
     * Indica si el equipo entero sigue vivo
     * @type {boolean}
     */
    this.alive = true;


    /**
     * Identificador del equipo
     * @type {number}
     */
    this.id = _id;

    /**
     * Nombre del equipo
     * @type {string}
     */
    this.name = (_name && _name.trim()) || "Guest";

    /**
     * Unidades del equipo
     * @type {Unit[]}
     */
    this.units = [];

    /**
     *
     * @type {string}
     */
    this.color=get_random_color();


}



/**
 * Apply the inputs from a agent of this current iteration
 * @param _inputs
 */
Team.prototype.applyInputs=function(_inputs){

};

/**
 * Añade una unidad al equipo
 *
 * Adds a unit to the team
 * @param {Unit} _unit
 */
Team.prototype.addUnit=function(_unit){
  this.units.push(_unit);
};


/**
 * Elimina la unitad de la posición indicada
 *
 * Delete the unit at the _index position
 * @param {number} _index
 */
Team.prototype.removeUnit=function(_index){
    delete this.units[_index];
};



/**
 * GETTERS && SETTERS
 */


/**
 * Devuelve si el equipo sobrevive o no
 * @returns {boolean} True si está vivo, false si no
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
 * @param _index
 * @returns {Unit} unit
 */
Team.prototype.Unit = function (_index) {
    return this.units[_index];
};

module.exports = Team;
