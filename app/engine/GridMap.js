"use strict";
var Point2D,Vector2D;


Point2D = require("./vendor/Point2D");
Vector2D = require("./vendor/Vector2D");

/**
 * Constants
 */
var TYPE={
    AIR:0,
    BLOCK:1
};

/**
 * Esta clase se encargará de todos los aspectos relativos al mapa del juego, muros, colisiones, etc.
 *
 * @param name {String} Nombre del mapa.
 * @param colMap {int[][]} Array que representa el estado del mapa
 * @constructor
 */
function GridMap(_name,_colMap){
    // Map Attributes
    this.name   = _name;
    this.colMap = _colMap || []; //Rellenar con el colmap que venga de fichero o de cualquier sitio
    this.width  = 500;//_colMap.length(); //_colMap.width(); //TODO:fix para debug
    this.height = 500;//_colMap.length[0](); //_colMap.height(); //TODO:fix para debug
    this.scale  = 1;
    //this.initializeColMap();
}

/**
 * Inicializa un mapa de colisiones en blanco con muros en los bordes.
 * -=1-=1
 * Initialize a blank col map with walls in the boundaries.
 */
GridMap.prototype.initializeColMap=function(){
    for(var i=0;i<this.width;i+=1){
        for(var j=0;j<this.height;j+=1){
            if(i===0||i===this.width||j===0||j===this.height)
            {
                this.getColMap()[i][j]=TYPE.BLOCK;
            }
            this.getColMap()[i][j]=TYPE.AIR;
        }
    }
};

/**
 * Crea un muro entre las coordenadas introducidas, tomadas como esquinas del rectángulo que definirá el muro.
 *
 * @param {Point2D} _posIni
 * @param {Point2D} _posFin
 */
GridMap.prototype.setWall=function(_posIni,_posFin){
    if(!(_posIni instanceof Point2D)||!(_posFin instanceof Point2D))
    {
        throw 'Cant check parameters, they re not a valid Point2D';
    }
    if(this.isOutsideBounds(_posIni)||this.isOutsideBounds(_posFin))
    {
        throw 'Some of the points is outside bounds of the map';
    }


    for(var i=_posIni.x;(_posIni.x<_posFin.x)?i<_posFin.x:i>_posFin.x;(_posIni.x<_posFin.x)?i+=1:i-=1){
        for(var j=_posIni.y;(_posIni.y<_posFin.y)?j<_posFin.y:j>_posFin.y;(_posIni.y<_posFin.y)?j+=1:j-=1){
            this.getColMap()[i][j]=TYPE.BLOCK;
        }
    }
};

/**
 *  todo Lee el mapa de colisiones de un fichero o de base de datos
 */
GridMap.prototype.loadColMap=function(_name){


};

/**
 * todo Guarda el mapa de colisiones en un fichero o base de datos.
 */
GridMap.prototype.saveColMap=function(_name){

};

/**
 * Obtiene el tipo de celda del mapa de colisiones de un punto dado.
 * ----
 * Get the cell type in the collision map array
 * @param _point {Point2D}
 * @returns {int}
 */
GridMap.prototype.getMapCell=function(_point){
    var point=_point.clone();
    //Transformamos el punto a la escala del mapa
    point.multiply(1/this.scale);
    point.x=Math.floor(point.x);
    point.x=Math.floor(point.y);

    return point;
};

/**
 * Comprueba si la posición indicada se encuentra en colision con algun objeto del mapa
 * -=1-=1-=1
 * Function that checks the point especified is a collision type
 * @param _point {Point2D}
 * @returns {boolean}
 */
GridMap.prototype.isOnCollision=function(_point){
    if(!(_point instanceof Point2D))
    {
        throw "Can't check this point, is not a valid Point2D";
    }
    var point=this.getMapCell(_point);
    if(!this.isOutsideBounds(point))
    {
        return this.isObstacle(this.getColMap()[point.x][point.y]);
    }

    //Si el punto está fuera del mapa devolvemos true.
    return true;
};

/**
 * Comprueba si el tipo de bloque indicado por parámetro es un obstaculo.
 * @param _block {int}
 * @returns {boolean}
 */
GridMap.prototype.isObstacle=function(_block){
   return _block===TYPE.BLOCK;
};

/**
 * Comprueba que el punto especificado por parámetro se encuentra dentro del mapa.
 * @param _point {Point2D}
 */
GridMap.prototype.isOutsideBounds=function(_point){
    var point=this.getMapCell(_point);
    return (point.x < 0 || point.x >= this.colMap.length || point.y < 0 || point.y >= this.colMap[point.x].length);
};


/**
 * Checks if, between two positions, there is no obstacle, taking into account the radius of the ship.
 * @param _posIni {Point2D}
 * @param _posFin {Point2D}
 * @param _object {Entity}
 * @param _radius {double}
 *
 * @return {boolean}
 */
GridMap.prototype.checkObsFree = function(_posIni, _posFin, _object, _radius){
    return (this.checkObsFreeDistance(_posIni,_posFin, _object, _radius) === -1);
};

/**
 * Checks if, betweeen two positions, there is no obstacle, taking into account the radius of the ship.
 * Returns the distance to the fist obstacle found, or -1 if no obstacle.
 * @param _posIni {Point2D}
 * @param _posFin {Point2D}
 * @param _object {Entity}
 * @param _radius {double}
 */
GridMap.prototype.checkObsFreeDistance=function(_posIni,_posFin,_object,_radius){
    var increment=_radius;
    /** @type {Vector2D}*/
    var posIni=_posIni.clone();
    /** @type {Vector2D}*/
    var posFin=_posFin.clone();
    /** @type {Vector2D}*/
    var dir = _posFin.subtract(_posIni);

    //Guardamos la distancia al punto de destino
    var distance = dir.length();

    //Normalizamos el vector de dirección al destino.
    dir.normalize();
    dir.multiply(increment);

    var acum=increment;
    while(acum<increment){
        posIni.add(dir);
        //todo El objeto tanque debe tener este método para comprobar las colisiones y así saber si desde el punto origen puede llegar hasta el punto final sin chocarse con ningún objeto.
        if(_object.checkCollisionInPosition(posIni)){
            return acum;
        }

    }

    return -1;

};

/**
 * #### GETTERS & SETTERS ####
 */

GridMap.prototype.getName = function(){
    return this.name;
};

GridMap.prototype.getColMap = function(){
    return this.colMap;
};

GridMap.prototype.getWidth = function(){
    return this.width;
};

GridMap.prototype.getHeight = function(){
    return this.height;
};

GridMap.prototype.getScale = function(){
    return this.scale;
};

module.exports = GridMap;


