"use strict";
var _,Unit,GridMap,Point2D;


_ = require("underscore");
Unit = require("./Unit");
GridMap = require("./GridMap");
Point2D=require('./vendor/Point2D');


/**
 * Representa un juego
 * @param {GridMap} _map Mapa sobre el que se va a presentar el juego
 * @constructor
 */
function Game(_map) {
    //Checks
    if (!_map instanceof GridMap) {
        throw "El parámetro 'map' debe ser un objeto válido 'Map'.";
    }

    this.map = _map;
    this.units = {};




    //todo futuras implementaciones
    this.gameObjects={};
    this.totalTime=0;

}


/**
 * Realiza una iteracción del juego.
 */
Game.prototype.tick=function(){

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

    _.each(this.units,function(_unit){
        if(_unit.position===_position){
            return true;
        }
    });
    return this.map.isOnCollision;
};


/**
 * Crea una unidad con valores aleatorios
 * @returns {Unit}
 */
Game.prototype.createRandomUnit=function(){

    //Posicion aleatoria
    var rx=Math.random()*this.map.width;
    var ry=Math.random()*this.map.height;
    if(this.checkPosition()){
        this.createRandomUnit();
    }

    //inicializamos factores de la unidad aleatoriamente
// _speed,_armor, _damage, _fireRate, _fireDistance
    var uSpeed=Math.random()*2+1;
    var uArmor=1;
    var uDamage=Math.random()*2+1;
    var uFireRate=10;
    var uFireDist=Math.random()*3+1;
    return new Unit(new Point2D(rx,ry),uSpeed,uArmor,uDamage,uFireRate,uFireDist);

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
    for(var i=0;i<this.map.width;i+=1){
        for(var j=0;j<this.map.height;j+=1) {
            render+=" "+this.map.getBlockAscii(this.map.colMap[i][j])+" ";
        }
        render+="\n";
    }
    console.log(render);
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