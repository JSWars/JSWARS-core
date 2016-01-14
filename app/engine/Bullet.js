"use strict";
var _, Vector2D, Angle;

_ = require("underscore");
Vector2D = require('./vendor/Vector2D');


var _defaultProperties = {
	//TODO Poner default properties
};


/**
 *
 * @param {Game} _game
 * @param {Vector2D} _position
 * @param {number} _teamId
 * @param {Vector2D} _angle
 * @param {number} _speed
 * @param {number} _damage
 * @param {number} _radius
 * @constructor
 */
function Bullet(_game, _position, _teamId, _angle, _speed, _damage, _radius) {

	/**
	 * @type {Game}
	 */
	this.game = _game;

	/**
	 * @type {number}
	 */
	this.id = _game.totalBullets += 1;

	/**
	 * @type {Vector2D}
	 */
	this.position = _position;

	/**
	 * Bullet team id
	 * @type {number}
	 */
	this.teamId = _teamId;

	/**
	 * @type {Vector2D}
	 */
	this.angle = _angle;
	/**
	 * @type {number}
	 */
	this.speed = _speed;
	/**
	 * @type {number}
	 */
	this.damage = _damage;

	/**
	 * @type{number}
	 */
	this.radius = _radius;

	/**
	 *
	 * @type {Vector2D[]}
	 */
	this.collSphereRelative = [];

	this.numPointsCollSphere = 8;

	this.createCollSphere();

}

Bullet.prototype.createCollSphere = function () {

	var angle = (2.0 * Math.PI) / this.numPointsCollSphere;

	this.collSphereRelative[0] = (new Vector2D(this.radius, 0)).multiply(this.radius);
	for (var i = 1; i < this.numPointsCollSphere; i += 1) {
		this.collSphereRelative[i] = this.collSphereRelative[i - 1];
		this.collSphereRelative[i] = this.collSphereRelative[i].rotate(angle);
	}

};

/**
 * Updates the bullet position
 */
Bullet.prototype.update = function () {
	//Actualizar la posición de la bala.
	var vDir = this.angle;
	this.position = this.position.add(vDir.multiply(this.speed));
};


/**
 * Checks the bullet collision
 */
Bullet.prototype.checkCollisions = function () {
	if (this.game.map.isOnCollision(this.position)) {
		return true;
	}
	for (var i = 0; i < this.collSphereRelative.length; i += 1) {
		if (this.game.map.isOnCollision(this.position.add(this.collSphereRelative[i]))) {
			return true;
		}
	}

	//TODO AHORA MISMO TAN SÓLO SE ESTÁ COMPROBANDO LA COLISION EN CADA ITERACIÓN, FALTARÍA COMPROBAR EN TODOS LOS ESTADOS ENTRE LAPOSICIÓN ACTUAL Y LA ANTERIOR
	if (this.game.checkUnitHit(this)) {
		return true;
	}

	return false;

};

Bullet.prototype.checkUnitHit = function () {

};

module.exports = Bullet;
