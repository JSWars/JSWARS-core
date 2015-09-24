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
function AgentController(_id) {

	this.id = _id;
	this.ownerId = undefined;
	this.game = undefined;
	this.timeout = undefined;
	this.timeoutStart=1000;
	this.agent = undefined;
	this.prepared = false;

	this.persistence={};

	var _self = this;
	AgentVersion.findOne({agent: _id}).sort('-moment')
		.exec(function (err, agentVersion) {
			if (err) {
				console.log("Error recovering agent");
				return;
			}
			if (agentVersion === null) {
				console.log("Error agent null");
				return;
			}

			_self.agent = VM.createScript(agentVersion.code);

			_self.prepared = true;

		});

	this.sandbox = {
		input: new AgentInput(this.game, this.ownerId),
		output: new AgentOutput(),
		utils:{
			Action: Action,
			Vector2D: Vector2D,
			Angle: Angle
		},
		persistence:this.persistence
	};

}

AgentController.prototype.setGameConfig = function (_game, _ownerId) {

	if (!(_game instanceof Game.constructor)) {
		throw "El parámetro 'game' debe ser un objeto 'Game' correcto.";
	}

	this.game = _game;
	this.ownerId = _ownerId;
	//this.timeout = 1000 / _fps / _.keys(this.game.teams).length;
	this.prepared = true;
};


AgentController.prototype.isPrepared = function () {
	this.prepared = this.prepared || (!_.isUndefined(this.game) && !_.isUndefined(this.timeout));
	return this.prepared;
};


/**
 * Tiempo de inicialización del agente, se deja un tiempo concreto de cómputo para que puedan
 * analizar la partida antes de comenzar
 */
AgentController.prototype.prepareGame=function(){
	if (!this.isPrepared()) {
		throw "The controller isn't prepared";
	}

	try {
		//console.log("Timeout : " + this.timeout);
		//this.agent.runInNewContext(this.sandbox, this.timeoutStart);
	} catch (exception) {
		console.dir(exception);
		throw "El agente ha excedido el tiempo máximo de proceso";
	}

	//TODO CONTROLAR EL TAMAÑO PARA QUE NO SE VAYA A LA PUTA
	this.persistence=this.sandbox.persistence;

	return this.sandbox.output.unitsActions;

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
		this.agent.runInNewContext(this.sandbox.runTick, this.timeout);
	} catch (exception) {
		console.dir(exception);
		throw "El agente ha excedido el tiempo máximo de proceso";
	}

	//TODO CONTROLAR EL TAMAÑO PARA QUE NO SE VAYA A LA PUTA
	this.persistence=sandbox.persistence;

	return sandbox.output.unitsActions;

};

//TODO MOSTRAR LOS ERRORES AL QUE LO HA PROGRAMAO

module.exports = AgentController;
