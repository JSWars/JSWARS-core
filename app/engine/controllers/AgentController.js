"use strict";
/**
 * Created by Marcos on 1/02/14.
 */


var VM = require("vm");
var _ = require("underscore");
var Game = require("../Game");
var AgentOutput = require("./interfaces/AgentOutput");
var Angle = require("../vendor/Angle");
var Vector2D = require("../vendor/Vector2D");


var Agent = require('../../model/Agent');
var AgentVersion = require('../../model/AgentVersion');

/**
 * El controlador de agente usa fragmentos de javascript para calcular los futuros movimientos
 * del equipo.
 * @constructor
 */
function AgentController(_id, _game, _teamId) {

	this.id = _id;
	this.teamId = _teamId;
	this.game = _game;
	this.timeout = 500;
	this.timeoutStart = 2000;
	this.agent = undefined;
	this.prepared = false;

	var _contextObject = {};

	//Creating util property in ctx object
	Object.defineProperty(_contextObject, 'Utils', {
		writable: false,
		value: {
			Vector2D: Vector2D
		}
	});

	this.context = new VM.createContext(_contextObject);
	var _self = this;

	AgentVersion.findOne({agent: _id}).sort('-moment')
		.exec(function (err, agentVersion) {
			if (err) {
				throw "Error loading agent from database";
			}
			if (agentVersion === null) {
				throw "Can't find agent";
			}

			VM.runInContext(agentVersion.code, _self.context);

			_self.prepared = true;
		});
}


AgentController.prototype.isPrepared = function () {
	return this.prepared;
};


/**
 * Tiempo de inicialización del agente, se deja un tiempo concreto de cómputo para que puedan
 * analizar la partida antes de comenzar
 */
AgentController.prototype.prepareTeams = function () {
	if (!this.isPrepared()) {
		throw "The agent isn't prepared";
	}

	this.context.game = this.game.getGameState();
	this.context.me = this.game.teams[this.teamId].units;

	try {
		VM.runInContext("init()", this.context, {timeout: this.timeoutStart});
	} catch (exception) {
		console.dir(exception);
		throw "El agente ha excedido el tiempo máximo de proceso";
	}

	return true;
};

/**
 * Ejecuta en el sandbox el código del agente y devuelve la salida para la ronda
 * @returns {*}
 */
AgentController.prototype.tick = function () {

	if (!this.isPrepared()) {
		throw "The controller isn't prepared";
	}

	try {
		this.context.output = new AgentOutput();
		this.context.log = function (a) {
			console.log(a)
		};
		VM.runInContext("tick()", this.context, {timeout: this.timeout});
	} catch (exception) {
		throw "El agente ha excedido el tiempo máximo de proceso";
	}

	return this.context.output;

};

module.exports = AgentController;
