"use strict";
var Point2D,Vector2D,Graph,PF,_;

Point2D = require("./vendor/Point2D");
Vector2D = require("./vendor/Vector2D");
Graph = require('./vendor/astar');
PF = require('pathfinding');
_ = require('underscore');
/**
 * Constants
 */
var TYPE={
    AIR:0,
    BLOCK:1,
    UNIT:2
};
var GRID=null;
/**
 * Esta clase se encargará de todos los aspectos relativos al mapa del juego, muros, colisiones, etc.
 *
 * @param name {String} Nombre del mapa.
 * @param colMap {int[][]} Array que representa el estado del mapa
 * @constructor
 */
function GridMap(_name){
    // Map Attributes
    this.name   = _name;
    this.colMap = []; //Rellenar con el colmap que venga de fichero o de cualquier sitio
    this.grid  = null;
    this.finder = null;
    this.width  = 25;//_colMap.length(); //_colMap.width();
    this.height = 25;//_colMap.length[0](); //_colMap.height();
    this.scale  = 1;
}


/**
 *Inicializa la malla de colisiones que se utilizará para el cálculo de rutas. Tener en cuenta llamar a esta función si se modifica el mapa.
 */
GridMap.prototype.initializeGrid=function(){
    this.grid=new PF.Grid(this.width,this.height, _.extend(this.colMap,{}));
    GRID= _.extend(this.grid,{});
    this.finder=new PF.AStarFinder();

};

/**
 * Calcula la ruta desde _posIni hasta _posFin y devuelve un array con las posiciones de la ruta
 * @param {Point2D} _posIni
 * @param {Point2D} _posFin
 * @returns {Array.<number|number[]>}
 */
GridMap.prototype.getPath=function(_posIni,_posFin){

    //TODO ESTOY BLOQUEADO AQUI, NO FUNKA CAGO EN LA HOSTIA YA
    var test = this.finder.findPath(_posIni.x,_posIni.y,_posFin.x,_posFin.y, _.extend(GRID,{}));
    //console.log(test);
    return test;

};



/**
 * Inicializa un mapa de colisiones en blanco con muros en los bordes.
 * -=1-=1
 * Initialize a blank col map with walls in the boundaries.
 */
GridMap.prototype.initializeColMap=function(){

    //Rellenamos los bordes con bloques
    for(var i=0;i<this.width;i+=1){
        this.colMap[i]=[];
        for(var j=0;j<this.height;j+=1){
            if(i===0||i===this.width-1||j===0||j===this.height-1)
            {
                this.colMap[i][j]=TYPE.BLOCK;
            }else{
                this.colMap[i][j]=TYPE.AIR;
            }

        }
    }

    //Ponemos algun murico
    //this.setHorizontalWall(new Point2D(5,5),15);
    //this.setHorizontalWall(new Point2D(20,5),15);

    console.log("Mapa inicializado.");
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

    //TODO ESTO DE AQUI ABAJO NO FUNKA
    //for(var i=_posIni.x;(_posIni.x<_posFin.x)?i<_posFin.x:i>_posFin.x;(_posIni.x<_posFin.x)?i+=1:i-=1){
    //    for(var j=_posIni.y;(_posIni.y<_posFin.y)?j<_posFin.y:j>_posFin.y;(_posIni.y<_posFin.y)?j+=1:j-=1){
    //        this.getColMap()[i][j]=TYPE.BLOCK;
    //    }
    //}
};


/**
 * @param {Point2D} _ini
 * @param {Point2D} _fin
 */
GridMap.prototype.setHorizontalWall=function(_posIni,_lenght){
    for(var i=_posIni.y;i<(_posIni.y+_lenght);i+=1){
        this.colMap[_posIni.x][i]=TYPE.BLOCK;
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

GridMap.prototype.getBlockAscii=function(_block){
    switch(_block){
        case TYPE.BLOCK:
            return "#";
        case TYPE.AIR:
            return " ";
        case TYPE.UNIT:
            return "@";
        default:
            return "%";
    }
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
    if(!this.isOutsideBounds(_point))
    {
        return this.isObstacle(this.getColMap()[_point.x][_point.y]);
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
 * Checks if, betweeen two positions, there is no obstacle, taking into account the radius of the ship.
 * Returns the distance to the fist obstacle found, or -1 if no obstacle.
 * @param _posIni {Point2D}
 * @param _posFin {Point2D}
 * @param _object {Unit}
 * @param _radius {number}
 */
GridMap.prototype.checkObsFreeDistance=function(_posIni,_posFin,_object,_radius){

    //TODO FUNCTION UNTESTED AND UNUSUED, FUTURE IMPLEMENTATION
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
    while(acum<distance){
        posIni.add(dir);

        if(_object.checkCollisionInPosition(posIni)){
            return acum;
        }
        acum+=increment;

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


