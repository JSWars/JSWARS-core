"use strict";
/**
 * Created by Marcos on 1/02/14.
 */


var VM = require("vm");
var FS = require("fs");
var _ = require("underscore");
var Game = require("../Game");
var AgentInput = require("./interfaces/AgentInput");
var AgentOutput = require("./interfaces/AgentOutput");
var Action = require("../Action");
var Angle = require("../vendor/Angle");
var Vector2D = require("../vendor/Vector2D");

/**
 * El controlador de agente usa fragmentos de javascript para calcular los futuros movimientos
 * del equipo.
 * @constructor
 */
function AgentController(_agentPath) {
    //Todo: Revisar si el fichero es damasiado grande
    if (!FS.existsSync(_agentPath)) {
        throw "La ruta para el agente no es válida";
    }

    this.agent = VM.createScript(FS.readFileSync(_agentPath));
    this.ownerId = undefined;
    this.game = undefined;
    this.timeout = undefined;
    this.prepared = true;
}

AgentController.prototype.setGameConfig = function (_game, _ownerId, _fps) {

     if (_game instanceof Game) {
     throw "El parámetro 'game' debe ser un objeto 'Game' correcto.";
     }

    this.game = _game;
    this.ownerId = _ownerId;
    //this.timeout = 1000 / _fps / _.keys(this.game.teams).length;
	this.prepared=true;
};


AgentController.prototype.isPrepared = function () {
    this.prepared = this.prepared || (!_.isUndefined(this.game) && !_.isUndefined(this.timeout));
    return this.prepared;
};

/**
 * Ejecuta en el sandbox el código del agente y devuelve la salida para la ronda
 * @param _agentInput
 * @returns {*}
 */
AgentController.prototype.tick = function () {

    if (!this.isPrepared()) {
        throw "The controller isn't prepared";
    }

    var sandbox = {
        input: new AgentInput(this.game, this.ownerId),
        output: new AgentOutput(),
		 	Action: Action,
		 Vector2D: Vector2D,
		 Angle: Angle
    };

    try {
        //console.log("Timeout : " + this.timeout);
        this.agent.runInNewContext(sandbox, this.timeout);
    } catch (exception) {
        console.dir(exception);
        throw "El agente ha excedido el tiempo máximo de proceso";
        //TODO: no devolver una exepción, controlar el error correctamente
    }

    return sandbox.output.unitsActions;

};

module.exports = AgentController;
