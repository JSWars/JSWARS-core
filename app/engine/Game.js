"use strict";
var Q, _, Unit, GridMap, Vector2D, Team, Bullet, Util, Action, AgentController, AgentGame, Logger,EasyStar;

Q = require('q');
_ = require("underscore");
Unit = require("./Unit");
GridMap = require("./GridMap");
Vector2D = require('./vendor/Vector2D');
Team = require('./Team');
Bullet = require('./Bullet');
Util = require('./vendor/Util');
AgentController = require("./controllers/AgentController");
Logger = require('../logger.js');

EasyStar = require('easystarjs');

AgentGame = require("./controllers/interfaces/AgentGame");


/**
 * Representa una instancia de juego
 * @constructor
 */
function Game() {
	/**
	 * Mapa del juego
	 * Map of the game
	 * @type {GridMap}
	 */
	this.map = null;

	/**
	 * Equipos
	 * Teams
	 * @type {Team{}}
	 */
	this.teams = {};

	/**
	 * Agents
	 * @type {AgentController}
	 */
	this.agents = [];

	/**
	 *
	 * @type {Array[Bullet]}
	 */
	this.bullets = [];
	/**
	 * Total de equipos
	 * @type {number}
	 */
	this.totalTeams = 0;


	/**
	 * Total units
	 * @type {number}
	 */
	this.totalBullets = 0;

	/**
	 *
	 * @type {number}
	 */
	this.totalTicks = 0;

	this.timeLeft = 2000;
}

Game.prototype.initialize = function () {
	return this.prepare();
};

Game.prototype.prepare = function () {
	var agentPromises = [];
	_.each(this.teams, function (_team) {
		agentPromises.push(_team.prepare());
	});

	//Creamos una promesa compuesta del resto de promesas
	return Q.all(agentPromises)
};

Game.prototype.run = function (_startCallBack, _tickCallBack, _endCallback) {

	while (!this.checkGameFinished()) {

		this.tick();

		if (typeof _tickCallBack === 'function') {
			_tickCallBack(this.totalTicks, this.getGameFrame());
		}

	}

	//if(typeof _endCallback === 'function') {
	//	_endCallback();
	//}

};


/**
 * Selecciona el mapa donde se va a jugar
 * @param _map
 */
Game.prototype.setMap = function (_map) {
	Logger.log('debug', 'New gridmap');
	this.map = new GridMap("MapTest", this);
	Logger.log('debug', 'Loading colmap');
	this.map.loadColMap(_map);
	Logger.log('debug', 'Initializing pathfinding');
	this.map.initializePathfinding();
};


/**
 * Add's a bullet to the game
 * @param {Bullet} _bullet
 */
Game.prototype.addBullet = function (_bullet) {
	this.bullets.push(_bullet);
	this.totalBullets += 1;
};


/**
 * Create a team by _id
 * @param {String} _agent of the team
 */
Game.prototype.addTeam = function (_agent) {
	var team = new Team(this.totalTeams, _agent, this);
	this.teams[this.totalTeams] = team;
	this.totalTeams++;
	return team;
};

/**
 * Elimina el equipo con el identificador indicado por parámetro
 *
 * Deletes the team by the id
 * @param {number} _id
 */
Game.prototype.removeTeam = function (_id) {
	delete this.teams[_id];
	this.totalTeams -= 1;

};


/**
 * Realiza una iteracción del juego.
 *
 * Do a game iteration
 */
Game.prototype.tick = function () {

	this.totalTicks += 1;

	Logger.log('debug', 'Starting tick cicle');

	//Apply inputs
	//Update positions
	//Checks collisions

	//Get registered actions from agents
	Logger.log('debug', 'Loading unit actions');
	this.loadUnitActions();
	//Unit moves
	Logger.log('debug', 'Units moving');
	this.unitsMove();
	//Unit attacks
	Logger.log('debug', 'Units attacking');
	this.unitAttack();
	//Update al teams
	Logger.log('debug', 'Update team healts');
	this.updateHealths();
	Logger.log('debug', 'Checking if game has finished');
	this.checkGameFinished();
	Logger.log('debug', 'Tick cicle ended');
};

/**
 *
 */
Game.prototype.updateHealths = function () {
	_.each(this.teams, function (_team) {
		_team.updateHealth();
	});
};


/**
 * Checks if the current game finished
 *
 * @return {boolean}
 */
Game.prototype.checkGameFinished = function () {
	var teamsAlive = 0;
	_.each(this.teams, function (_team) {
		if (_team.isAlive()) {
			teamsAlive += 1;
		}
	});

	return (teamsAlive <= 1) || (this.totalTicks >= this.timeLeft);
};

/**
 * Gets the agents actions and apply in the game
 */
Game.prototype.loadUnitActions = function () {
	Logger.log('debug', 'Loading actions from agents execution');
	_.each(this.teams, function (_team) {
		Logger.log('debug', 'Loading actions for agent ' + _team.id);
		var agentOutput = _team.agent.tick();
		for (var unit in agentOutput.actions) {
			for (var action in agentOutput.actions[unit]) {
				_team.units[unit][action + "Handler"](agentOutput.actions[unit][action]);
			}
		}
	});
};

/**
 * Actualiza las posiciones
 *
 * Update all the players creatures positions
 */
Game.prototype.unitsMove = function () {
	try {
		_.each(this.teams, function (_team) {
			_.each(_team.units, function (_unit) {
				//Actualizar posición de las unidades que están vivas
				if (_unit.alive) {
					_unit.update();
				}
			}, this);
		}, this);
	} catch (e) {
		Logger.log('error', e);
		console.log(e)
	}
};

/**
 *
 */
Game.prototype.unitAttack = function () {
	_.each(this.bullets, function (_bullet) {
		_bullet.update();
	});

	//Delete the bullets in collision
	this.bullets = _.filter(this.bullets, function (_bullet) {
		return !_bullet.checkCollisions();
	});
};


/**
 * Comprueba si la posición especificada por parámetro encuentra colisión con otro jugador o bloque del mapa
 *
 * @param {Vector2D} _position
 * @return {boolean} if the position is on collision returns true
 */
Game.prototype.checkPosition = function (_position) {
	Util.isInstance(_position, Vector2D);

	return this.map.isOnCollision(_position);
};

/**
 * Check if the bullet hit an unit
 * @param {Bullet} _bullet
 * @returns {boolean}
 */
Game.prototype.checkUnitHit = function (_bullet) {
	var hit = false;
	_.each(this.teams, function (_team) {
		if (_team.id !== _bullet.teamId) {
			_.each(_team.units, function (_unit) {
				if (_unit.isAlive()) {
					//Calculate the distance to the object
					var vDist, minDist;
					vDist = _unit.position.subtract(_bullet.position);
					minDist = _bullet.radius + _unit.radius;
					//If the object is closest than the two radius return collision
					if (vDist.mag() <= minDist) {
						_unit.hurt(_bullet.damage);
						hit = true;
					}
				}
			});
		}
	});
	return hit;
};


/**
 * Obtiene una posicion libre del mapa
 * @returns {Vector2D}
 */
Game.prototype.getRandomFreeCell = function () {
	//Posición aleatoria
	var rx = Math.floor(Math.random() * this.map.width);
	var ry = Math.floor(Math.random() * this.map.height);
	if (this.checkPosition(new Vector2D(rx, ry))) {
		return this.getRandomFreeCell();
	}
	return new Vector2D(rx + 0.5, ry + 0.5);
};


/*
 * AGENT FUNCTIONS
 */

/**
 * Get the current game state ready to send to the agents
 */
Game.prototype.getGameState = function () {
	var teams = [];
	_.each(this.teams, function (_team) {
		var teamPicked = _.pick(_team, "id", "name", "color");
		teamPicked.units = [];
		_.each(_team.units, function (_unit) {
			var unitPicked = _.pick(_unit, "health", "alive", "position", "radius");
			//var unitPicked= _.omit(_unit,"game");
			teamPicked.units.push(unitPicked);
		});
		teams.push(teamPicked);
	});

	var bullets = [];
	_.each(this.bullets, function (_bullet) {
		var bulletPicked = _.pick(_bullet, "id", "teamId", "position", "radius");
		bullets.push(bulletPicked);

	});

	var gameState = {
		"teams": teams,
		"bullets": bullets,
		"colMap": this.map.colMap
	};

	return gameState;
};


/**
 * Get the current game state ready to insert in mongodb
 */
Game.prototype.getGameFrame = function () {
	var teams = {};

	//recorremos los equipos
	_.each(this.teams, function (_team) {
		var teamPicked = _.pick(_team, "id", "name", "color", "health");
		teamPicked.units = [];
		//Recorremos las unidades
		_.each(_team.units, function (_unit) {
			var unitPicked = _.pick(_unit, "health", "alive", "position", "radius", "attackTo","moveTo");
			//var unitPicked= _.omit(_unit,"game");
			teamPicked.units.push(unitPicked);
		});
		teams[teamPicked.id] = teamPicked;
	});

	var bullets = {};
	_.each(this.bullets, function (_bullet) {
		var bulletPicked = _.pick(_bullet, "id", "teamId", "position", "radius");
		bullets[_bullet.id] = bulletPicked;

	});

	var frame = {
		"teams": teams,
		"bullets": bullets

	};
	return frame;
};

/**
 * Devuelve el equipo especificado por su identificador
 * @param {number} Identificador
 * @returns {Team} Equipo
 */
Game.prototype.getTeam = function (id) {
	return this.teams[id];
};


module.exports = Game;
