"use strict";
var _,Unit,GridMap,Point2D,Team;


_ = require("underscore");
Unit    = require("./Unit");
GridMap = require("./GridMap");
Point2D = require('./vendor/Point2D');
Team    = require('./Team');


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
     * Total de equipos
     * @type {number}
     */
    this.totalTeams=0;


    this.initMap();

    //todo Next implementations...
    this.gameObjects=[];

    this.totalTime=0;



}

/**
 *
 */
Game.prototype.initMap=function(){
    this.map=new GridMap("MapTest",this);
    this.map.initializeColMapDefault();
};



/**
 * Create a team by _id
 * @param {String} _id of the team
 */
Game.prototype.addTeam=function(_id){

    this.teams[this.totalTeams]=(new Team(this.totalTeams,_id,this));
    this.totalTeams+=1;



};

/**
 * Elimina el equipo con el identificador indicado por parámetro
 *
 * Deletes the team by the id
 * @param {number} _id
 */
Game.prototype.removeTeam=function(_id){
    delete this.teams[_id];
    this.totalTeams-=1;

};


/**
 * Realiza una iteracción del juego.
 *
 * Do a game iteration
 */
Game.prototype.tick=function(){

    //Apply inputs
    //Update positions
    //Checks collisions
    this.updatePositions();
};

/**
 * Actualiza las posiciones
 *
 * Update all the players creatures positions
 */
Game.prototype.updatePositions=function(){
    _.each(this.teams,function(_team){
        _.each(_team.units,function(_unit){
            //Actualizar posición de las unidades
            this.moveUnit(_unit);
        },this);
    },this);
};

/**
 * Mueve la unidad
 *
 * Move the unit
 * @param {Unit} _unit
 */
Game.prototype.moveUnit=function(_unit){
    //Si la unidad no tiene path o ha llegado a su destino.
    if(_unit.moveTo.length!==0&&_unit.path.length===0)
    {
        var dest = _unit.moveTo[0];
        _unit.path=this.map.getPath(_unit.position.clone(),dest.clone());
        console.log();
    }
    _unit.updatePosition();
};


/**
 * Comprueba si la posición especificada por parámetro encuentra colisión con otro jugador o bloque del mapa
 *
 * @param {Point2D} _position
 */
Game.prototype.checkPosition=function(_position){
    if (!_position instanceof Point2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Point2D'.";
    }
    return this.map.isOnCollision(_position);
};

/**
 *
 * @param {Point2D}_position
 * @returns {boolean}
 */
Game.prototype.checkPositionUnit=function(_position){
    //TODO HACER DE NUEVO COLISIONES ENTRE UNIDADES
    /**
     * DEPRECATED COMO UNA CASA
     */
    _.each(this.teams,function(_team){
        _.each(_team.units,function(_unit){
            if(_unit.getPosition().x === _position.x && _unit.getPosition().y === _position.y){
                return true;
            }
        });
    });
    return false;
};


/**
 * Crea una unidad con valores por defecto
 * @returns {Unit}
 */
Game.prototype.createDefaultUnit=function(){
    // _speed,_armor, _damage, _fireRate, _fireDistance

    var properties={
        position:this.getRandomFreeCell(),//OBLIGATORIO
        radius:0.1,
        speed:0.1,
        armor:0,
        damage:1,
        fireRate:10,
        fireDistance:5
    };
    return new Unit(this,properties);

};


/**
 * Obtiene una posicion libre del mapa
 * @returns {Point2D}
 */
Game.prototype.getRandomFreeCell=function(){
    //Posicion aleatoria
    var rx=Math.floor(Math.random()*this.map.width);
    var ry=Math.floor(Math.random()*this.map.height);
    if(this.checkPosition(new Point2D(rx,ry))){
        return this.getRandomFreeCell();
    }
    return new Point2D(rx,ry);
};


/**
 * AGENT FUNCTIONS
 */

/**
 * Returns the agents inputs for a game iteration
 */
Game.prototype.applyAgentInputs=function(){
    //TODO PEDIR AL AGENTE REALIZAR UNA ACCIÓN
};



/**
 * RENDER FUNCTIONS
 */

/**
 * Dibuja el mapa en la consola
 */
Game.prototype.render=function(){
    //this.map.render();
    var render="";
    var renderMap = this.map.colMap.slice(0);
    _.each(this.teams,function(_team){
        _.each(_team.units,function(_unit){
            renderMap[_unit.position.y][_unit.position.x]=2;
        });
    });


    for(var i=0;i<this.map.width;i+=1){
        for(var j=0;j<this.map.height;j+=1) {
            {
                render+=" "+this.map.getBlockAscii(renderMap[i][j])+" ";
            }
        }
        render+="\n";
    }
    console.log(render);

    //render player stats
    this.renderPlayerStats();
};


/**
 *
 * @return {String}
 */
Game.prototype.renderPlayerStats=function(){
    var turn="";
    _.each(this.teams,function(_team){
        _.each(_team.units,function(_unit){
            turn+="\nPosition: "+_unit.position;
            turn+="\nDest: "+_unit.moveTo;
            turn+="\nPath: "+_unit.path;

        },this);
    },this);
    console.log(turn);
};


/**
 * GETTERS & SETTERS
 */

/**
 * Devuelve el mapa que se está usando en el juego
 * @returns {Map} Mapa
 */
Game.prototype.getMap = function () {
    return this.map;
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