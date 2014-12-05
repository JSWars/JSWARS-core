"use strict";
var Point2D;

Point2D=require("./vendor/Point2D");


/**
 * Representa un Tanque.
 * @constructor
 * @param {Point2D} _position Posicion del centro dla entidad.
 * @param {number} _speed
 * @param {number} _armor
 * @param {number} _damage
 * @param {number} _fireRate
 * @param {number} _fireDistance
 * @constructor
 */
function Unit(_position, _speed,_armor, _damage, _fireRate, _fireDistance) {
    /**
     * Indica si la unidad está viva
     * @type {boolean}
     */
    this.alive = true;
    /**
     * Posición de la unidad
     * @type {Point2D}
     */
    this.position = _position;
    /**
     * Velocidad de movimiento de la unidad
     * @type {number}
     */
    this.speed = _speed;
    /**
     * Armadura de la unidad
     * @type {number}
     */
    this.armor = _armor;

    /**
     * Daño de la unidad
     * @type {number}
     */
    this.damage=_damage;

    /**
     * Cadencia de tiro
     * @type {number}
     */
    this.fireRate=_fireRate;

    /**
     * Alcance del disparo
     * @type {number}
     */
    this.fireDistance=_fireDistance;


    /**
     * Array con las órdenes de movimiento de la unidad
     *@type {Point2D[]}
     */
    this.moveTo=[];

    /**
     *
     * @type {Array}
     */
    this.attackTo=[];

}


/**
 * Para la unidad
 */
Unit.prototype.stop=function(){
    this.moveTo=[];
};

/**
 * Añade un destino de movimiento al array moveTo
 * @param {Point2D} _position
 */
Unit.prototype.addDestination=function(_position){
    if (!_position instanceof Point2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Point2D'.";
    }
    this.moveTo.push(_position);
};

/**
 * Elimina los destinos anteriores de la unidad y añade un único destino
 * @param {Point2D} _position
 */
Unit.prototype.moveTo=function(_position){
    if (!_position instanceof Point2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Point2D'.";
    }
    this.stop();
    this.addDestination(_position);
    return true;
};

/**
 * Realiza un ataque a la posición
 * @param {Point2D} _position
 */
Unit.prototype.attackTo=function(_position){
    this.attackTo=[];
    this.attackTo.push(_position);

};



/**
 * GETTERS & SETTERS
 */

/**
 * Devuelve si la entidad está viva
 * @returns {boolean}
 */
Unit.prototype.isAlive = function () {
    return this.alive;
};



/**
 * Devuelve la posicion actual como 2DVector
 * @returns {Point2D} con la posición actual
 */
Unit.prototype.getPosition = function () {
    return this.position;
};

/**
 * Devuelve la armadura base
 * @returns {number} Armadura
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

/**
 *
 * @returns {number}
 */
Unit.prototype.getFireDistance=function(){
    return this.fireDistance;
};

/**
 *
 * @param {number} _fireDistance
 */
Unit.prototype.setFireDistance=function(_fireDistance){
    this.fireDistance=_fireDistance;
};
/**
 *
 * @returns {number}
 */
Unit.prototype.getFireRate=function(){
    return this.fireRate;
};

/**
 *
 * @param _fireRate
 */
Unit.prototype.setFireRate=function(_fireRate){
    this.fireRate=_fireRate;
};
module.exports = Unit;