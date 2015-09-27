"use strict";
var Q, _, Unit, GridMap, Vector2D, Team, Bullet, Util, Action, AgentController;

Q = require('q');
_ = require("underscore");
Unit = require("./Unit");
GridMap = require("./GridMap");
Vector2D = require('./vendor/Vector2D');
Team = require('./Team');
Bullet = require('./Bullet');
Util = require('./vendor/Util');
Action = require('./Action');
AgentController = require("./controllers/AgentController");


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
	 * Chunk
	 */
	this.chunk = [];


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
	this.totalUnits = 0;

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

	/**
	 *
	 * @type {number}
	 */
	this.totalAgents = 0;


	//todo Next implementations...
	this.gameObjects = [];

	this.timeLeft = 2000;


}

Game.prototype.initialize = function (_deferred) {
	var deferred = _deferred || Q.defer();
	var _self = this;
	var ready = true;
	_.each(this.teams, function (_team) {
		if (!_team.agent.prepared) {
			ready = false;
		}

	});
	if (ready) {
		_.each(this.teams, function (_team) {
			_team.update();
		});

		this.prepareTeams();
		deferred.resolve();
	} else {
		setTimeout(function () {
			_self.initialize(deferred);
		}, 100);
	}



	return deferred.promise;

};

Game.prototype.prepareTeams=function(){
	_.each(this.teams, function (_team) {
		_team.agent.prepareTeams();
	});
};

Game.prototype.run = function(_startCallBack,_tickCallBack,_endCallback){

	while(!this.checkGameFinish()){

		this.tick();

		if(typeof _tickCallBack === 'function'){
			_tickCallBack(this.totalTicks,this.getGameFrame());
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
	this.map = new GridMap("MapTest", this);
	this.map.loadColMap(_map);
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
Game.prototype.addTeam = function ( _agent) {
	this.teams[this.totalTeams] = new Team(this.totalTeams, _agent, this);
	return this.totalTeams++;
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

	//Apply inputs
	//Update positions
	//Checks collisions

	this.getAgentActions();
	this.updatePositions();
	this.updateBullets();

	this.update();
	this.checkGameFinish();

	return this.getGameFrame();
};

Game.prototype.update = function () {
	_.each(this.teams, function (_team) {
		_team.update();
	});
};


/**
 * Checks if the current game finished
 *
 * @return {boolean}
 */
Game.prototype.checkGameFinish = function () {
	var teamsAlive=0;
	_.each(this.teams, function (_team) {
		if(_team.isAlive()){
			teamsAlive+=1;
		}
	});

	return (teamsAlive<=1) || (this.totalTicks>=this.timeLeft);
};

/**
 * Gets the agents actions and apply in the game
 */
Game.prototype.getAgentActions = function () {
	_.each(this.teams, function (_team) {
		var action = _team.agent.tick();
		_.each(action, function (_action, _idUnit) {
			_team.units[_idUnit].moveTo(_action.move);
			_team.units[_idUnit].addAttackOrder(_action.attack);
		});
	});
};

/**
 * Actualiza las posiciones
 *
 * Update all the players creatures positions
 */
Game.prototype.updatePositions = function () {
	_.each(this.teams, function (_team) {
		_.each(_team.units, function (_unit) {
			//Actualizar posición de las unidades que están vivas
			if (_unit.alive) {
				_unit.update();
			}
		}, this);
	}, this);
};

Game.prototype.updateBullets = function () {
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
				//Calculate the distance to the object
				var vDist, minDist;
				vDist = _unit.position.subtract(_bullet.position);
				minDist = _bullet.radius + _unit.radius;
				//If the object is closest than the two radius return collision
				if (vDist.mag() <= minDist) {
					_unit.hurt(_bullet.damage);
					hit = true;
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
	//Posicion aleatoria
	var rx = Math.floor(Math.random() * this.map.width);
	var ry = Math.floor(Math.random() * this.map.height);
	if (this.checkPosition(new Vector2D(rx, ry))) {
		return this.getRandomFreeCell();
	}
	return new Vector2D(rx + 0.5, ry + 0.5);
};


/**
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

	var chunk = {
		"teams": teams,
		"bullets": bullets
	};

	this.chunk.push(chunk);
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
			var unitPicked = _.pick(_unit, "health", "alive", "position", "radius");
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
 * RENDER FUNCTIONS
 */

/**
 * Dibuja el mapa en la consola
 */
Game.prototype.render = function () {
	var render = "";
	var renderMap = this.map.colMap.slice(0);

	_.each(this.teams, function (_team) {
		_.each(_team.units, function (_unit) {
			renderMap[Math.floor(_unit.position.y)][Math.floor(_unit.position.x)] = 2;
		});
	});
	_.each(this.bullets, function (_bullet) {
		renderMap[Math.floor(_bullet.position.y)][Math.floor(_bullet.position.x)] = 3;
	});

	for (var i = 0; i < this.map.width; i += 1) {
		for (var j = 0; j < this.map.height; j += 1) {
			{
				render += " " + this.map.getBlockAscii(renderMap[i][j]) + " ";
			}
		}
		render += "\n";
	}

	console.log(render);

	//render player stats
	this.renderPlayerStats();
};


/**
 *
 * @return {String}
 */
Game.prototype.renderPlayerStats = function () {
	var turn = "";
	_.each(this.teams, function (_team) {
		_.each(_team.units, function (_unit) {
			turn += "\nPosition: " + _unit.position;
			turn += "\nDest: " + _unit.direction.angle;

		}, this);
	}, this);
	console.log(turn);
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
