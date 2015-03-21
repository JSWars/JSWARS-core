"use strict";
var _,Unit,GridMap,Vector2D,Team,Bullet,Util;


_ = require("underscore");
Unit    = require("./Unit");
GridMap = require("./GridMap");
Vector2D = require('./vendor/Vector2D');
Team    = require('./Team');
Bullet  = require('./Bullet');
Util = require('./vendor/Util');


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
     *
     * @type {Array[Bullet]}
     */
    this.bullets=[];
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

	/**
	 * Total units
	 * @type {number}
	 */
	this.totalBullets=0;


	/**
     *
     * @type {number}
     */
    this.totalTime=0;



    this.initMap();

    //todo Next implementations...
    this.gameObjects=[];


}

/**
 * Add's a bullet to the game
 * @param {Bullet} _bullet
 */
Game.prototype.addBullet=function(_bullet){
    this.bullets.push(_bullet);
};


/**
 * Initialize the map
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
	this.teams[this.totalTeams]=(new Team(this.totalTeams+=1,_id,this));
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
    this.updateBullets();
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

Game.prototype.updateBullets=function(){
    _.each(this.bullets,function(_bullet){
        _bullet.update();
    });

    //Delete the bullets in collision
    this.bullets=_.filter(this.bullets,function(_bullet){
        return !_bullet.checkCollisions();
    });
};



/**
 * Comprueba si la posición especificada por parámetro encuentra colisión con otro jugador o bloque del mapa
 *
 * @param {Vector2D} _position
 * @return {boolean} if the position is on collision returns true
 */
Game.prototype.checkPosition=function(_position){
    Util.isInstance(_position,Vector2D);

    return this.map.isOnCollision(_position);
};

/**
 * Check if the bullet hit an unit
 * @param {Bullet} _bullet
 * @returns {boolean}
 */
Game.prototype.checkUnitHit=function(_bullet){


	//todo falta filtrar los equipos para no golpear a unidades del mismo equipo
    _.each(this.teams,function(_team){
        _.each(_team.units,function(_unit){
			  //Calculate the distance to the object
			  var vDist,minDist;
			  vDist = _unit.position.subtract(_bullet.position);
			  minDist = _bullet.radius+_unit.radius;
			  //If the object is closest than the two radius return collision
			  if(vDist.mag()<=minDist){
				  _unit.hurt(_bullet.damage);
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
            var unitPicked= _.pick(_unit,"alive","position","radius");
            //var unitPicked= _.omit(_unit,"game");
            teamPicked.units.push(unitPicked);
        });
        teams.push(teamPicked);
    });

    var bullets=[];
    _.each(this.bullets,function(_bullet){
        var bulletPicked= _.pick(_bullet,"id","teamId","position","radius");
		  bullets.push(bulletPicked);

    });

    var chunk={
       "teams":teams,
		 "bullets":bullets
    };

    this.chunk.push(chunk);
};


/**
 * RENDER FUNCTIONS
 */

/**
 * Dibuja el mapa en la consola
 */
Game.prototype.render=function(){
    var render="";
    var renderMap = this.map.colMap.slice(0);

    _.each(this.teams,function(_team){
        _.each(_team.units,function(_unit){
            renderMap[Math.floor(_unit.position.y)][Math.floor(_unit.position.x)]=2;
        });
    });
    _.each(this.bullets,function(_bullet){
        renderMap[Math.floor(_bullet.position.y)][Math.floor(_bullet.position.x)]=3;
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
            turn+="\nDest: "+_unit.direction.angle;

        },this);
    },this);
    console.log(turn);
};


/**
 * GETTERS & SETTERS
 */

/**
 * Devuelve el mapa que se está usando en el juego
 * @returns {GridMap} Mapa
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
