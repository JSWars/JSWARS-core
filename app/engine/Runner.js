"use strict";
var _,Game,Config;


_ = require("underscore");
Game = require("./Game");
Config = require("./Config");


Runner.STATES = {
    INITIALIZING: 0,
    RUNNING: 1,
    PAUSED: 2,
    ENDED: 3
};

Runner.CONTROLLER_TYPE = {
    AGENT: 1,
    REMOTE: 2 //Unused
};

/**
 * Representa un controlador que se ocupará de gestionar todos los movimientos del juego en
 * función a los controladores
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
 * Inicia la partida
 */
Runner.prototype.start = function () {

    if (this.controllers.length !== this.game.teams.length) {
        throw "No se han definido controladores para todos los jugadores.";
    }

    if (this.state !== Runner.STATES.INITIALIZING) {
        throw "No se puede iniciar la partida ahora";
    }

    this.intervalId = setInterval(_.bind(this.tick,this), 1000 / this.fps);

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


/**
 * Procesa un equipo, solicitando para ello un tick al controlador
 * @param _team Objeto del equipo
 * @param _teamId Identificador del equipo.
 * @private
 */
Runner.prototype._processTeam = function (_team, _teamId) {
    var teamController = this.controllers[_teamId];
    var controllerOutput = teamController.tick();

    _(_team.tanks)
        .chain()
        .filter(this._isAlive)
        .each(function(_tank,_tankId){
            this._processTank(_tank,_tankId,controllerOutput.getTankOutput(_tankId));
        }, this)

    if(_.countBy(_team.tanks,this._isAlive)["true"]==0){
        _team.setAlive(false);
    }

}

/**
 *
 */
Runner.prototype.tick = function () {

    !Config.debug || console.log("Procesando tick para el juego");

    _(this.game.teams)
        .chain()
        .filter(this._isAlive)
        .each(this._processTeam, this);

    if(_.countBy(this.game.teams,this._isAlive)["true"]<=1){
        this.end();
    }
}


module.exports = Runner;