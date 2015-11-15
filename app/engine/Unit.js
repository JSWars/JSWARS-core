"use strict";
var _, Vector2D, Angle, Bullet, Util, Logger;

_ = require("underscore");
Vector2D = require("./vendor/Vector2D");
Angle = require("./vendor/Angle");
Bullet = require("./Bullet");
Util = require("./vendor/Util");
Logger = require('../logger.js');

var TYPE = {
	RANGE: 0,
	BODY: 1
};

/**
 * Default properties
 *
 */
var defaultProperties = {
	position: null,//OBLIGATORIO
	radius: 0.2,
	speed: 0.1,
	health: 100,
	armor: 0,
	damage: 20,
	fireRate: 100,
	fireDistance: 5,
	type: TYPE.RANGE
};


/**
 * Representa un Tanque.
 * @constructor
 * @param {Game} _game Instancia del juego
 * @param {Team} _team Equipo enemigo.
 * @param _properties
 * @constructor
 */
//function Unit(_game,_position, _speed, _armor, _damage, _fireRate, _fireDistance) {
function Unit(_game, _team, _properties) {
	/**
	 * Instancia del juego
	 * @type {Game}
	 */
	this.game = _game;

	/**
	 * Instancia del equipo al que pertenece la unidad
	 */
	this.teamId = _team;


	/**
	 * Indica si la unidad está viva
	 * @type {boolean}
	 */
	this.alive = true;


	/**
	 * Attack cooldown of the unit, set the firerate when shoot and decrease 1 per tick
	 * @type {number}
	 */
	this.cooldown = 0;


	/**
	 *
	 * @type {Array[Vector2D]}
	 */
	this.collSphereRelative = [];

	/**
	 * Numero de puntos para el collsphere
	 * @type {number}
	 */
	this.numPointsCollSphere = 8;


	/**
	 * PROPERTIES OF THE UNIT
	 */

	/**
	 * Posición de la unidad
	 *
	 * Units position
	 * @type {Vector2D}
	 */
	this.position = (_properties.position) ? new Vector2D(_properties.position[0], _properties.position[1]) : defaultProperties.position;


	/**
	 * Radio de la unidad
	 * Unit's radius for collisions and future implementations
	 * @type {number}
	 */
	this.radius = (_properties.radius) ? _properties.radius : defaultProperties.radius;


	/**
	 * Velocidad de movimiento de la unidad
	 * @type {number}
	 */
	this.speed = (_properties.speed) ? _properties.speed : defaultProperties.speed;

	/**
	 * Armadura de la unidad
	 * @type {number}
	 */
	this.armor = (_properties.armor) ? _properties.armor : defaultProperties.armor;


	/**
	 * Daño de la unidad
	 * @type {number}
	 */
	this.damage = (_properties.damage) ? _properties.damage : defaultProperties.damage;


	/**
	 * Cadencia de tiro
	 * Fire Rate of the unit
	 * @type {number}
	 */
	this.fireRate = (_properties.fireRate) ? _properties.fireRate : defaultProperties.fireRate;


	/**
	 * Alcance del disparo
	 * @type {number}
	 */
	this.fireDistance = (_properties.fireDistance) ? _properties.fireDistance : defaultProperties.fireDistance;


	/**
	 * Health of the unit
	 * @type {number}
	 */
	this.health = (_properties.health) ? _properties.health : defaultProperties.health;

	/**
	 * Max health of the unit
	 * @type {number}
	 */
	this.maxHealth = (_properties.health) ? _properties.health : defaultProperties.health;


	/**
	 * UNIT'S ACTIONS ATTRIBUTES
	 */

	/**
	 * Unit's direction angle
	 * @type {Angle}
	 */
	this.direction = undefined;

	/**
	 * Unit's direction attack
	 * @type {Angle}
	 */
	this.attackTo = undefined;
	//TODO create a specific class to Attacks

	this.createCollSphere();

}

/**
 * Create a relative collsphere
 */
Unit.prototype.createCollSphere = function () {
	var angle = (2.0 * Math.PI) / this.numPointsCollSphere;

	this.collSphereRelative[0] = new Vector2D(this.radius, 0);
	for (var i = 1; i < this.numPointsCollSphere; i += 1) {
		this.collSphereRelative[i] = this.collSphereRelative[i - 1];
		this.collSphereRelative[i] = this.collSphereRelative[i].rotate(angle);
	}

};

/**
 * Unit's update
 */
Unit.prototype.update = function () {
	this.attack();
	this.move();
};

/**
 * Deal _damage to the unit. Set alive to false if the health<=0
 * @param {number} _damage
 */
Unit.prototype.hurt = function (_damage) {
	this.health -= _damage;
	if (this.health <= 0) {
		this.alive = false;
	}
};


/**
 * Attack to position
 * @param {Vector2D} _attackPosition
 */
Unit.prototype.attackToHandler = function (_attackPosition) {

	Logger.log('debug','Unit attack to position',_attackPosition);
	Util.isInstance(_attackPosition, Vector2D);
	this.attackTo = _attackPosition.subtract(this.position).normalize();
};

/**
 * Elimina los destinos anteriores de la unidad y añade un único destino
 * @param {Vector2D} _position
 */
Unit.prototype.moveToHandler = function (_position) {
	Util.isInstance(_position, Vector2D);
	Logger.log('debug','Unit move to position',_position);
	this.direction = _position.subtract(this.position).normalize();
};


/**
 * Do an attack
 */
Unit.prototype.attack = function () {
	this.cooldown -= 1;
	if (this.cooldown <= 0 && this.attackTo !== undefined) {

		var b = new Bullet(this.game, this.position, this.teamId, this.attackTo, 0.2, this.damage, 0.25);
		this.game.addBullet(b);
		this.cooldown = this.fireRate;
	}
};


/**
 * Move the unit in the direction give by this.direction attribute
 */
Unit.prototype.move = function () {
	//If action is false, do nothing

	if (this.direction === undefined) {
		return;
	}

	var dir = this.direction;

	if (!this.checkCollide(this.position.add(dir.multiply(this.speed)))) {
		//if the next position is free, update the unit's position
		this.position = this.position.add(dir.multiply(this.speed));
	}

};

Unit.prototype.stop = function () {
	this.direction = undefined;
};


Unit.prototype.checkCollide = function (_position) {

	if (this.game.map.isOnCollision(_position)) {
		return true;
	}
	for (var i = 0; i < this.collSphereRelative.length; i += 1) {
		if (this.game.map.isOnCollision(_position.add(this.collSphereRelative[i]))) {
			return true;
		}
	}

	return false;
};


/**
 * GETTERS & SETTERS
 */

/**
 * Checks if the unit's is alive
 * @returns {boolean} returns true if the unit is alive
 */
Unit.prototype.isAlive = function () {
	return this.alive;
};


/**
 * Devuelve la posicion actual como 2DVector
 * @returns {Vector2D} con la posición actual
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
Unit.prototype.getFireDistance = function () {
	return this.fireDistance;
};

/**
 *
 * @param {number} _fireDistance
 */
Unit.prototype.setFireDistance = function (_fireDistance) {
	this.fireDistance = _fireDistance;
};

/**
 * @returns {number}
 */
Unit.prototype.getFireRate = function () {
	return this.fireRate;
};

/**
 *
 * @param _fireRate
 */
Unit.prototype.setFireRate = function (_fireRate) {
	this.fireRate = _fireRate;
};


/**
 *
 * @type {Vector2D}
 */
Unit.prototype.checkCollisionInPosition = function (_position) {
	return this.game.checkPosition(_position);

};

module.exports = Unit;
