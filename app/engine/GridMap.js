"use strict";
var Vector2D, Graph, PF, _, defaultOptions, defaultMap, EasyStar, Logger;

Vector2D = require("./vendor/Vector2D");
Graph = require('./vendor/astar');
PF = require('pathfinding');
_ = require('underscore');
EasyStar = require('easystarjs');
Logger = require('../logger.js');
/**
 * Constants
 */
var TYPE = {
	AIR: 0,
	BLOCK: 1,
	UNIT: 2,
	BULLET: 3
};
var GRID = null;


/**
 * Defaults GridMap Attributes
 */
defaultOptions = {
	height: 25,
	width: 25,
	cellSize: 20
};

defaultMap = {
	"height": 30,
	"layers": [
		{
			"data": [20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 37, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 13, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 18],
			"height": 30,
			"name": "GridMap",
			"opacity": 1,
			"type": "tilelayer",
			"visible": true,
			"width": 30,
			"x": 0,
			"y": 0
		}],
	"nextobjectid": 1,
	"orientation": "orthogonal",
	"properties": {},
	"renderorder": "left-up",
	"tileheight": 32,
	"tilesets": [
		{
			"firstgid": 1,
			"image": "template7x7_0.png",
			"imageheight": 224,
			"imagewidth": 224,
			"margin": 0,
			"name": "template7x7_0",
			"properties": {},
			"spacing": 0,
			"tileheight": 32,
			"tilewidth": 32
		}],
	"tilewidth": 32,
	"version": 1,
	"width": 30
};

/**
 * Esta clase se encargará de todos los aspectos relativos al mapa del juego, muros, colisiones, etc.
 *
 * {String} _name Name of the map
 * {Game} Instance of the game
 * @constructor
 */
function GridMap(_name, _game) {
	// Map Attributes
	/**
	 * Instance of the game
	 * {Game}
	 */
	this.game = _game;

	/**
	 * TiledMap
	 * @type {null}
	 */
	this.tiledMap = null;
	/**
	 * Name of the map
	 * {String}
	 */
	this.name = _name;
	/**
	 * Array con las colisiones del mapa
	 * Collision map
	 * @type {int[][]}
	 */
	this.colMap = [];


	/**
	 * Grid from pathfindingjs
	 * @type {Grid}
	 */
	this.grid = null;
	/**
	 * Astar finder from pathfindingjs
	 * @type {AStarFinder}
	 */
	this.finder = null;

	/**
	 * Ancho del mapa
	 * @type {number}
	 */
	this.width = 25;
	/**
	 * Alto del mapa
	 * @type {number}
	 */
	this.height = 25;
	/**
	 * Escala del mapa, para futuras implementaciones
	 *
	 * GridMap scale
	 * @type {number}
	 */
	this.scale = 1;

	this.easystar = undefined;


	//todo setear opciones de los mapas, max equipos para el mapa, zonas de comienzo de cada equipo, etc
}


/**
 *Inicializa la malla de colisiones que se utilizará para el cálculo de rutas. Tener en cuenta llamar a esta función si se modifica el mapa.
 *
 * Ini
 */
GridMap.prototype.initializePathfinding = function () {
	this.easystar = new EasyStar.js();
	this.easystar.enableSync();
	var grid = this.colMap;
	this.easystar.setGrid(grid);
	this.easystar.setAcceptableTiles([0]);


};

/**
 * Calcula la ruta desde _posIni hasta _posFin y devuelve un array con las posiciones de la ruta
 * @param {Vector2D} _posIni
 * @param {Vector2D} _posFin
 * @returns {Array.<number|number[]>}
 */
GridMap.prototype.getPath = function (_posIni, _posFin) {
	//clonamos el objeto grid antes de recorrerlo.
	var gridClone = this.grid.clone();
	var pathResult = this.finder.findPath(_posIni.x, _posIni.y, _posFin.x, _posFin.y, gridClone);
	return pathResult;

};


/**
 *  todo Lee el mapa de colisiones de un fichero o de base de datos
 */
GridMap.prototype.loadColMap = function (_map) {
	this.tiledMap = _map;
	this.scale = _map.width;

	/**
	 * Load collision map
	 */
	for (var layerIdx = 0; layerIdx < _map.layers.length; layerIdx += 1) {
		if (_map.layers[layerIdx].type !== "tilelayer") {
			continue;
		}
		var layer = _map.layers[layerIdx];
		var name = layer.name;
		this.width = layer.width;
		this.height = layer.height;
		//todo crear especificaciones de nombres para las capas de los mapas
		if (name === "GridMap") {

			this.width = layer.width;
			this.height = layer.height;


			for (var i = 0; i < layer.width; i += 1) {
				this.colMap[i] = [];
				for (var j = 0; j < layer.height; j += 1) {
					var cellType = layer.data[i * layer.width + j];
					if (cellType !== 0) {
						this.colMap[i][j] = TYPE.BLOCK;
					} else {
						this.colMap[i][j] = TYPE.AIR;
					}
				}
			}
		}
	}

};

/**
 * todo Guarda el mapa de colisiones en un fichero o base de datos.
 */
GridMap.prototype.saveColMap = function (_name) {
	//TODO Futura implementacion para guardar mapas con editor de mapas o similar
};


/**
 * Function for debug drawing..
 *
 * @param _block
 * @returns {string}
 */
GridMap.prototype.getBlockAscii = function (_block) {
	switch (_block) {
		case TYPE.BLOCK:
			return "#";
		case TYPE.AIR:
			return " ";
		case TYPE.UNIT:
			return "@";
		case TYPE.BULLET:
			return "*";
		default:
			return "%";
	}
};


/**
 * Obtiene el tipo de celda del mapa de colisiones de un punto dado.
 * ----
 * Get the cell type in the collision map array, if the position giving is a double they will be apply Math.floor function
 * @param _point {Vector2D}
 * @returns {int}
 */
GridMap.prototype.getMapCell = function (_point) {
	var point = _point.clone();
	point.multiply(1 / this.scale);
	point.x = Math.floor(point.x);
	point.y = Math.floor(point.y);

	return point;
};

/**
 * Comprueba si el tipo de bloque indicado por parámetro es un obstaculo.
 *
 * Checks the block type give by parameter returns true if is an obstacle.
 * @param _block {int}
 * @returns {boolean}
 */
GridMap.prototype.isObstacle = function (_block) {
	return _block === TYPE.BLOCK;
};

/**
 * Comprueba si la posición indicada se encuentra en colision con algun objeto del mapa
 * -=1-=1-=1
 * Function that checks the point especified is a collision type
 * @param _point {Vector2D}
 * @returns {boolean}
 */
GridMap.prototype.isOnCollision = function (_point) {
	if (!(_point instanceof Vector2D)) {
		throw "Can't check this point, is not a valid Vector2D";
	}
	_point = _point.floor();
	if (!this.isOutsideBounds(_point)) {

		return this.isObstacle(this.colMap[_point.y][_point.x]);
	}

	//Si el punto está fuera del mapa devolvemos true.
	return true;
};

/**
 * Comprueba que el punto especificado por parámetro se encuentra dentro del mapa.
 *
 * Checks if the position give by parameter is inside the gridmap bounds
 * @param _point {Vector2D}
 */
GridMap.prototype.isOutsideBounds = function (_point) {
	var point = this.getMapCell(_point);
	return (point.x < 0 || point.x >= this.colMap.length || point.y < 0 || point.y >= this.colMap[0].length);
};


/**
 * Checks if, betweeen two positions, there is no obstacle, taking into account the radius of the ship.
 * Returns the distance to the fist obstacle found, or -1 if no obstacle.
 * @param _posIni {Vector2D}
 * @param _posFin {Vector2D}
 * @param _object {Unit}
 * @param _radius {number}
 */
GridMap.prototype.checkObsFreeDistance = function (_posIni, _posFin, _object, _radius) {

	//TODO FUNCTION UNTESTED AND FUTURE IMPLEMENTATION
	var increment = _radius;
	/**
	 * {Vector2D}
	 */

	var posIni = _posIni.clone();
	/** @type {Vector2D}*/
	var dir = _posFin.subtract(_posIni);

	//Guardamos la distancia al punto de destino
	var distance = dir.mag();

	//Normalizamos el vector de dirección al destino.
	dir = dir.normalize();
	dir = dir.multiply(increment);

	var acum = increment;
	while (acum < distance) {
		posIni = posIni.add(dir);

		if (_object.checkCollisionInPosition(posIni)) {
			return acum;
		}

		acum += increment;

	}

	return -1;

};

/**
 * #### GETTERS & SETTERS ####
 */

GridMap.prototype.getName = function () {
	return this.name;
};

GridMap.prototype.getColMap = function () {
	return this.colMap;
};

GridMap.prototype.getWidth = function () {
	return this.width;
};

GridMap.prototype.getHeight = function () {
	return this.height;
};

GridMap.prototype.getScale = function () {
	return this.scale;
};

module.exports = GridMap;


