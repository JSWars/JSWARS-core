"use strict";
var _,Vector2D,Util;
Vector2D=require('./Vector2D');
Util=require('./Util');

/*****
 *
 *   constructor
 *
 *****/
function Angle(_angle) {
    this.angle=_angle;
    this.action=true;
}

/**
 *
 * @returns {Vector2D} Returns angle normal vector
 */
Angle.prototype.toVector2D=function(){
    return new Vector2D(Math.cos(this.angle),Math.sin(this.angle));
};


/**
 * GETTERS & SETTERS
 */

/**
 * @param {boolean} _action
 */
Angle.prototype.setAction=function(_action){
    this.action=_action;
};

module.exports = Angle;