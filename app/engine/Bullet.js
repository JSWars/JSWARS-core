"use strict";
var _,Vector2D;

_ = require("underscore");
Vector2D = require('./vendor/Vector2D');
/**
 *
 * @param _position
 * @param _angle
 * @param _speed
 * @param _damage
 * @constructor
 */
function Bullet(_game,_position,_teamId,_angle,_speed,_damage,_radius){

    /**
     * @type {Game}
     */
    this.game=_game;

    /**
     * @type {Vector2D}
     */
    this.position=_position;

    /**
     * Bullet team id
     * @type {number}
     */
    this._teamId=_teamId;

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

    /**
     * @type{radius}
     */
    this.radius=_radius;

    this.collSphereRelative=[];

    this.createCollSphere();

}

Bullet.prototype.createCollSphere=function(){

    var angle= (2.0 * Math.PI) / this.numPointsCollSphere;

    this.collSphereRelative[0]=(new Vector2D(1,0)).multiply(this.radius);
    for(var i=1;i<this.numPointsCollSphere;i+=1){
        this.collSphereRelative[i]=this.collSphereRelative[i-1];
        this.collSphereRelative[i]=this.collSphereRelative[i].rotate(angle);
    }

};

/**
 *
 */
Bullet.prototype.update=function(){
    //Actualizar la posición de la bala.
    var vDir=new Vector2D(Math.cos(this.angle),Math.sin(this.x));
    this.position=this.position.add(vDir.multiply(this.speed));
};


/**
 *
 */
Bullet.prototype.checkCollisions=function(){
    if(this.game.map.isOnCollision(this.position)){
        return true;
    }
    for(var i=0;i<this.collSphereRelative.length;i++){
        if(this.game.map.isOnCollision(this.position.add(this.collSphereRelative[i]))){
            return true;
        }
    }

    return false;
    //TODO AHORA MISMO TAN SÓLO SE ESTÁ COMPROBANDO LA COLISION EN CADA ITERACIÓN, FALTARÍA COMPROBAR EN TODOS LOS ESTADOS ENTRE LAPOSICIÓN ACTUAL Y LA ANTERIOR
};