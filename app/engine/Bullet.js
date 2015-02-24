"use strict";
/**
 * Created by Luiss_000 on 24/02/2015.
 */

/**
 *
 * @param _position
 * @param _angle
 * @param _speed
 * @param _damage
 * @constructor
 */
function Bullet(_position,_angle,_speed,_damage){
    /**
     * @type {Vector2D}
     */
    this.position=_position;
    /**
     * @type {number}
     */
    this.angle=_angle;
    /**
     * @type {number}
     */
    this.speed=_speed;
    /**
     * @type {number}
     */
    this.damage=_damage;

}

/**
 *
 */
Bullet.prototype.update=function(){
    //Actualizar la posición de la bala.
};