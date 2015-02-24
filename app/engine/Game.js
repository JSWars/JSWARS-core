"use strict";
var _,Unit,GridMap,Vector2D,Team;


_ = require("underscore");
Unit    = require("./Unit");
GridMap = require("./GridMap");
Vector2D = require('./vendor/Vector2D');
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
     * Chunk
     */
    this.chunk=[];

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

    /**
     * Total units
     * @type {number}
     */
    this.totalUnits=0;


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
    this.getGameFrame();
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
            _unit.update();
        },this);
    },this);
};



/**
 * Comprueba si la posición especificada por parámetro encuentra colisión con otro jugador o bloque del mapa
 *
 * @param {Vector2D} _position
 */
Game.prototype.checkPosition=function(_position){
    if (!_position instanceof Vector2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Vector2D'.";
    }

    return this.map.isOnCollision(_position);
};

/**
 *
 * @param {Vector2D}_position
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
 * Obtiene una posicion libre del mapa
 * @returns {Vector2D}
 */
Game.prototype.getRandomFreeCell=function(){
    //Posicion aleatoria
    var rx=Math.floor(Math.random()*this.map.width);
    var ry=Math.floor(Math.random()*this.map.height);
    if(this.checkPosition(new Vector2D(rx,ry))){
        return this.getRandomFreeCell();
    }
    return new Vector2D(rx,ry);
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

Game.prototype.getGameFrame=function(){
    var teams=[];
    _.each(this.teams,function(_team){
        var teamPicked=_.pick(_team,"id","name","color");
        teamPicked.units=[];
        _.each(_team.units,function(_unit){
            var unitPicked= _.pick(_unit,"alive","position","speed","radius","speed","damage","fireRate","fireDistance","moveTo","path","attackTo");
            //var unitPicked= _.omit(_unit,"game");
            teamPicked.units.push(unitPicked);
        });
        teams.push(teamPicked);
    });

    this.chunk.push(teams);
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
            renderMap[_unit.position.y|0][_unit.position.x|0]=2;
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