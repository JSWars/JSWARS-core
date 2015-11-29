"use strict";
var _, Game, Config;


_ = require("underscore");
Game = require("./Game");
Config = require("./Config");


/**
 * Representa un controlador que se ocupará de gestionar todos los movimientos del juego en
 * función a los controladores
 *
 * Runner will manage all game and agents controller interaction
 * @param {Game} _game
 * @param {number} _fps
 * @constructor
 */
function Runner(_game, _fps) {
	if (!_game instanceof Game) {
		throw "El parámetro 'game' debe ser un objeto válido 'Game'.";
	}

	this.game = _game;
	this.controllers = {};

	this.state = Runner.STATES.INITIALIZING;
	this.fps = _fps;


}

/**
 * States of the current game
 * @type {{INITIALIZING: number, RUNNING: number, PAUSED: number, ENDED: number}}
 */
Runner.STATES = {
	INITIALIZING: 0,
	RUNNING: 1,
	PAUSED: 2,
	ENDED: 3
};

/**
 * Agent type
 * @type {{AGENT: number, REMOTE: number}}
 */
Runner.CONTROLLER_TYPE = {
	AGENT: 1,
	REMOTE: 2 //Unused
};


/**
 * Inicia la partida
 */
Runner.prototype.start = function () {

	if (this.controllers.length !== this.game.teams.length) {
		throw "No se han definido controladores para todos los jugadores.";
	}

	if (this.state !== Runner.STATES.INITIALIZING) {
		throw "No se puede iniciar la partida ahora";
	}

	this.intervalId = setInterval(_.bind(this.tick, this), 1000 / this.fps);

	this.state = Runner.STATES.RUNNING;
}

/**
 * Finaliza la partida
 */
Runner.prototype.end = function () {
	clearInterval(this.intervalId);
	this.state = Runner.STATES.ENDED;
};


Runner.prototype._isAlive = function (_e) {
	if (typeof _e.isAlive === "function") {
		return _e.isAlive();
	} else {
		return false;
	}

};


module.exports = Runner;
