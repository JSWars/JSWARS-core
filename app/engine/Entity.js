"use strict";
var V2D;

V2D = require("./vendor/Vector2D");

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
function Entity(_position, _speed,_armor, _damage, _fireRate, _fireDistance) {
    this.alive = true;
    this.position = _position;
    this.body = null;
    this.speed = _speed;
    this.armor = _armor;
    this.speed = 0;

}


Entity.prototype.applyInputs=function(_input){

};

Entity.prototype.checksCollision=function(){

};

/**
 * Mueve la entidad una distancia determinada, en la dirección en la que se encuentra apuntando.
 *
 * @param {double }_distance Distancia a mover la entidad, positivo si se mueve hacia adelante y negativo si se mueve hacia atrás.
 */
Entity.prototype.move=function(_distance){
    //Transformamos el angulo dla entidad en un vector unitario con su dirección.
    var dirVect=new V2D(Math.cos(this.angle),Math.sin(this.angle));
    //Incrementamos la posición dla entidad en la distancia especificada por parámetro.
    this.position.add(dirVect.multiply(_distance));
};

/**
 * Gira la entidad _angle grados
 *
 * @param {double} _angle cantidad de grados a girar la entidad
 */
Entity.prototype.rotate=function(_angle){
    this.angle += _angle;
    this.angle = this.angle%(2*Math.PI);
};
/**
 * Devuelve si la entidad sobrevive o no
 * @returns True si está vivo, false si no
 */
Entity.prototype.isAlive = function () {
    return this.alive;
};


//GETTERS && SETTERS

/**
 * Devuelve la posicion actual como 2DVector
 * @returns 2DVector con la posición actual
 */
Entity.prototype.getPosition = function () {
    return this.position;
};

/**
 * Devuelve el ángulo base en radianes
 * @returns Ángulo en Radianes
 */
Entity.prototype.getAngle = function () {
    return this.angle;
};

/**
 * Devuelve la armadura base
 * @returns Armadura
 */
Entity.prototype.getArmor = function () {
    return this.armor;
};

/**
 * Devuelve la velocidad base
 * @returns {number} Speed
 */
Entity.prototype.getSpeed = function () {
    return this.speed;
};

/**
 * Returns Turret Object
 * @returns Turret
 */
Entity.prototype.getTurret = function () {
    return this.turret;
};

Entity.prototype.setBody=function(_body){
    this.body=_body;
};

Entity.prototype.getBody=function(){
    return this.body;
};

module.exports = Entity;
