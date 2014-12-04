"use strict";
var V2D,Point2D;

V2D = require("./vendor/Vector2D");
Point2D=require("./vendor/Point2D");

var TO_RADIANS = Math.PI / 180;


/**
 * Representa un Tanque.
 * @constructor
 * @param {Point2D} _position Posicion del centro dla entidad.
 * @param {double} _speed
 * @param {double} _armor
 * @param {double} _damage
 * @param {double} _fireRate
 * @param {double} _fireDistance
 * @constructor
 */
function Unit(_position, _speed,_armor, _damage, _fireRate, _fireDistance) {
    this.alive = true;
    this.position = _position;
    this.body = null;
    this.speed = _speed;
    this.armor = _armor;
    this.speed = 0;

}


/**
 * Mueve la unidad a la posición indicada por parámetro si esta se encuentra a distancia menor igual que su velocidad de movimiento
 * @param {Point2D} _position
 *
 * @return {boolean} Devuelve true si la operación se ha realizado con éxito
 */
Unit.prototype.moveTo=function(_position){
    if (!_position instanceof Point2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Point2D'.";
    }

    //Comprobamos que se pueda mover a esa posición
    //todo comprobar en mapa si libre de posicion de la unidad a posicion destino hay camino de longitud menor que speed


    this.position=_position;
    return true;
};


/**
 * Realiza un ataque a la posición
 * @param {Point2D} _position
 */
Unit.prototype.attackTo=function(_position){


};

/**
 * Se aplican las acciones indicadas por parámetro, movimiento, ataques etcetera
 * @param _input
 */
Unit.prototype.applyInputs=function(_input){


};




/**
 * Devuelve si la entidad sobrevive o no
 * @returns True si está vivo, false si no
 */
Unit.prototype.isAlive = function () {
    return this.alive;
};


//GETTERS && SETTERS

/**
 * Devuelve la posicion actual como 2DVector
 * @returns 2DVector con la posición actual
 */
Unit.prototype.getPosition = function () {
    return this.position;
};

/**
 * Devuelve la armadura base
 * @returns Armadura
 */
Unit.prototype.getArmor = function () {
    return this.armor;
};

/**
 * Devuelve la velocidad base
 * @returns {number} Speed
 */
Unit.prototype.getSpeed = function () {
    return this.speed;
};


module.exports = Unit;
