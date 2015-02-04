"use strict";
var Point2D;

Point2D=require("./vendor/Point2D");


/**
 * Default properties
 * @type {{_position: null, _speed: number, _armor: number, _damage: number, _fireRate: number, _fireDistance: number}}
 */
var defaultProperties = {
    position:null,//OBLIGATORIO
    radius:0.1,
    speed:0.1,
    armor:0,
    damage:1,
    fireRate:10,
    fireDistance:5
};
/**
 * Representa un Tanque.
 * @constructor
 * @param {Game} _game Instancia del juego
 * @param {Point2D} _position Posicion del centro dla entidad.
 * @param {number} _speed
 * @param {number} _armor
 * @param {number} _damage
 * @param {number} _fireRate
 * @param {number} _fireDistance
 * @constructor
 */
//function Unit(_game,_position, _speed, _armor, _damage, _fireRate, _fireDistance) {
function Unit(_game,_properties){
    //TODO CAMBIAR VARIABLES DE UNIT POR UN PROPERTIES EN EL QUE LOS VALORES PUEDAN SER OPCIONALES
    /**
     * Instancia del juego
     * @type {Game}
     */
    this.game=_game;


    /**
     * Indica si la unidad está viva
     * @type {boolean}
     */
    this.alive = true;

    /**
     *
     * @type {Array[Point2D]}
     */
    this.collSphereRelative=[];

    /**
     * Numero de puntos para el collsphere
     * @type {number}
     */
    this.numPointsCollSphere=8;


    /**
     * PROPERTIES OF THE UNIT
     * TODO FOR FUTURE IMPLEMENTATIONS AND SCALABLE DO A FUNCTION THAT LOADS AND SETS ALL THE PROPERTIES AND DEFAULT PROPERTIES
     */

    /**
     * Posición de la unidad
     *
     * Units position
     * @type {Point2D}
     */
    if(_properties.position)
    {
        this.position = _properties.position;
    }else{
        this.position = defaultProperties.position;
    }

    /**
     * Radio de la unidad
     * Unit's radius for collisions and future implementations
     * @type {number}
     */
    if(_properties.radius){
        this.radius=_properties.radius;
    }else{
        this.radius=defaultProperties.radius;
    }

    /**
     * Velocidad de movimiento de la unidad
     * @type {number}
     */
    if(_properties.speed){
        this.speed = _properties.speed;
    }else{
        this.speed = defaultProperties.speed;
    }
    /**
     * Armadura de la unidad
     * @type {number}
     */
    if(_properties.armor){

        this.armor = _properties.armor;
    }else{
        this.armor = defaultProperties.armor;
    }

    /**
     * Daño de la unidad
     * @type {number}
     */
    if(_properties.damage)
    {
        this.damage=_properties.damage;
    }else{
        this.damage=defaultProperties.damage;
    }

    /**
     * Cadencia de tiro
     * Fire Rate of the unit
     * @type {number}
     */
    if(_properties.fireRate)
    {
        this.fireRate=_properties.fireRate;
    }else{
        this.fireRate= defaultProperties.fireRate;
    }

    /**
     * Alcance del disparo
     * @type {number}
     */
    if(_properties.fireDistance)
    {
        this.fireDistance=_properties.fireDistance;
    }else{
        this.fireDistance= defaultProperties.fireDistance;
    }


    /**
     * UNIT'S ACTIONS ATTRIBUTES
     */

    /**
     * Array con las órdenes de movimiento de la unidad
     * Array with the move actions of the unit
     *@type {Point2D[]}
     */
    this.moveTo=[];

    /**
     * Array con los movimientos de la unidad desde su posición actual hasta el siguiente destino de moveTo
     *
     * Array with the units moves from his position to the next position destiny indicate in moveTo
     * @type {Array.<number|number[]}
     */
    this.path=[];

    /**
     * Units attack order to the position
     * @type {Point2D[]}
     */
    this.attackTo=[];


}

Unit.prototype.createCollSphere=function(){
    //double angle = 2.0 * Math.PI / numPoints;
    //m_collSphereRelative = new Vector2d[numPoints];
    //m_collSphere = new Vector2d[numPoints];
    //m_collPotentialSphere = new Vector2d[numPoints];
    //
    //m_collSphereRelative[0] = d.copy();
    //m_collSphereRelative[0].mul(1.5*radius);
    //m_collSphere[0] = new Vector2d();
    //m_collPotentialSphere[0] = new Vector2d();
    //for(int i = 1; i < m_collSphereRelative.length; ++i)
    //{
    //    m_collSphereRelative[i] = m_collSphereRelative[i-1].copy();
    //    m_collSphereRelative[i].rotate(angle);
    //    m_collSphere[i] = new Vector2d();
    //    m_collPotentialSphere[i] = new Vector2d();
    //}

    var angle= 2.0 * Math.PI / this.numPointsCollSphere;
    //TODO MAÑANA SEGUIR AQUI

};


/**
 * Actualiza la posición de la unidad usando path y moveTo
 *
 * Update the unit's position using path and moveTo
 */
Unit.prototype.updatePosition=function(){
    if(this.path.length!==0){

        //Asignamos la nueva posicion
        this.position=new Point2D(this.path[0][0],this.path[0][1]);
        //Eliminamos la posición del path
        this.path.splice(0,1);

        if(this.path.length===0&&this.moveTo.length!==0){
            //Si se ha llegado
            this.moveTo.splice(0,1);
        }
    }
};

/**
 * Para la unidad
 * Stops the unit
 */
Unit.prototype.stop=function(){
    this.moveTo=[];
    this.path=[];
};

/**
 * Añade un destino de movimiento al array moveTo
 *
 * Adds a destiny point to the array moveTo
 * @param {Point2D} _position
 */
Unit.prototype.addDestination=function(_position){
    if (!_position instanceof Point2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Point2D'.";
    }
    this.moveTo.push(_position);
};

/**
 * Elimina los destinos anteriores de la unidad y añade un único destino
 * @param {Point2D} _position
 */
Unit.prototype.moveTo=function(_position){
    if (!_position instanceof Point2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Point2D'.";
    }
    this.stop();
    this.addDestination(_position);
    return true;
};

/**
 * Realiza un ataque a la posición
 * @param {Point2D} _position
 */
Unit.prototype.attackTo=function(_position){
    this.attackTo=[];
    this.attackTo.push(_position);
};



/**
 * GETTERS & SETTERS
 */

/**
 * Devuelve si la entidad está viva
 * @returns {boolean}
 */
Unit.prototype.isAlive = function () {
    return this.alive;
};



/**
 * Devuelve la posicion actual como 2DVector
 * @returns {Point2D} con la posición actual
 */
Unit.prototype.getPosition = function () {
    return this.position;
};

/**
 * Devuelve la armadura base
 * @returns {number} Armadura
 */
Unit.prototype.getArmor = function () {
    return this.armor;
};

/**
 * Devuelve la velocidad base
 * @returns {number} Speed
 */
Unit.prototype.getSpeed = function () {
    return this.speed;
};

/**
 *
 * @returns {number}
 */
Unit.prototype.getFireDistance=function(){
    return this.fireDistance;
};

/**
 *
 * @param {number} _fireDistance
 */
Unit.prototype.setFireDistance=function(_fireDistance){
    this.fireDistance=_fireDistance;
};
/**
 *
 * @returns {number}
 */
Unit.prototype.getFireRate=function(){
    return this.fireRate;
};

/**
 *
 * @param _fireRate
 */
Unit.prototype.setFireRate=function(_fireRate){
    this.fireRate=_fireRate;
};


/**
 *
 * @type {Point2D}
 */
Unit.prototype.checkCollisionInPosition=function(_position){
    return this.game.checkPosition(_position);

};

module.exports = Unit;