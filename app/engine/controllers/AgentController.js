"use strict";
/**
 * Created by Marcos on 1/02/14.
 */


var VM = require("vm");
var _ = require("underscore");
var Game = require("../Game");
var AgentInput = require("./interfaces/AgentInput");
var AgentOutput = require("./interfaces/AgentOutput");
var Action = require("../Action");
var Angle = require("../vendor/Angle");
var Vector2D = require("../vendor/Vector2D");


var Agent = require('../../model/Agent');
var AgentVersion = require('../../model/AgentVersion');

/**
 * El controlador de agente usa fragmentos de javascript para calcular los futuros movimientos
 * del equipo.
 * @constructor
 */
function AgentController(_id, _game) {

	this.id = _id;
	this.game = _game;
	this.timeout = 500;
	this.timeoutStart = 2000;
	this.agent = undefined;
	this.prepared = false;

	this.persistence = {};
	this.context = new VM.createContext({
		Action: Action,
		Vector2D: Vector2D,
		Angle: Angle
	});
	var _self = this;


	AgentVersion.findOne({agent: _id}).sort('-moment')
		.exec(function (err, agentVersion) {
			if (err) {
				console.log("Error recovering agent", err);
				return;
			}
			if (agentVersion === null) {
				console.log("Error agent null");
				return;
			}

			//_self.agent = VM.createScript(agentVersion.code);

			VM.runInContext(agentVersion.code, _self.context);

			_self.prepared = true;

		});


}


AgentController.prototype.isPrepared = function () {
	this.prepared = this.prepared || (!_.isUndefined(this.game) && !_.isUndefined(this.timeout));
	return this.prepared;
};


/**
 * Tiempo de inicialización del agente, se deja un tiempo concreto de cómputo para que puedan
 * analizar la partida antes de comenzar
 */
AgentController.prototype.prepareTeams = function () {
	if (!this.isPrepared()) {
		throw "The controller isn't prepared";
	}

	try {
		//console.log("Timeout : " + this.timeout);
		this.context.input = new AgentInput(this.game);
		this.context.output = new AgentOutput();
		VM.runInContext("init(input)", this.context, {timeout: this.timeoutStart});
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
		//console.log("Timeout : " + this.timeout);
		this.context.input = new AgentInput(this.game);
		this.context.output = new AgentOutput();
		VM.runInContext("tick(input)", this.context, {timeout: this.timeout});
	} catch (exception) {
		console.dir(exception);
		throw "El agente ha excedido el tiempo máximo de proceso";
	}


	return this.context.output.unitsActions;

};

module.exports = AgentController;
