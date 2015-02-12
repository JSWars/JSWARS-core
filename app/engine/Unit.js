"use strict";
var Vector2D;

Vector2D=require("./vendor/Vector2D");


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
 * @param {Vector2D} _position Posicion del centro dla entidad.
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
     * @type {Array[Vector2D]}
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
     * @type {Vector2D}
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
     *@type {Vector2D[]}
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
     * @type {Vector2D[]}
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

    var angle= (2.0 * Math.PI) / this.numPointsCollSphere;
    //TODO HACER COLLSPHERE






};



/**
 * Mueve la unidad
 *
 * Move the unit
 * @param {Unit} _unit
 */
Unit.prototype.move=function(){

    var moveDistance;

    moveDistance=this.speed;
    /**
     * Actualiza la posición de la unidad usando path y moveTo
     *
     * Update the unit's position using path and moveTo
     */
    //Mientras
    while(moveDistance>0&&this.moveTo.length!==0){
        //Si la unidad no tiene path o no ha llegado a su destino.
        if(this.path.length===0)
        {
            //Obtenemos destino y calculamos path
            this.path=this.game.map.getPath(this.position.clone(),this.moveTo[0].clone());

            if(this.path.length===0){
                console.log("ERROR DE LA MUERTEEEEE");
            }
        }



        if(this.path.length>0){
            var nextPos,vNextPos;
            nextPos = new Vector2D(this.path[0][0]+0.5,this.path[0][1]+0.5);
            //CALCULAR SIGUIENTE POSICION DEL PATH QUE checkObsFreeDistance !=-1




            vNextPos= nextPos.subtract(this.position);

            //Si con moveDistance llegamos al siguiente path avanzamos hasta el siguiente path.
            if(vNextPos.mag()<moveDistance) {
                //Asignamos la nueva posicion
                this.position = new Vector2D(this.path[0][0]+0.5, this.path[0][1]+0.5);
                //Eliminamos la posición del path
                this.path.splice(0, 1);

                //FIX ULTRAMIERDER
                if(this.path.length===0){
                    this.moveTo.splice(0,1);
                }

            }else{
                this.position=this.position.add(vNextPos.normalize().multiply(moveDistance));
            }

            moveDistance -= vNextPos.mag();
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
 * @param {Vector2D} _position
 */
Unit.prototype.addDestination=function(_position){
    if (!_position instanceof Vector2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Vector2D'.";
    }
    this.moveTo.push(_position);
};

/**
 * Elimina los destinos anteriores de la unidad y añade un único destino
 * @param {Vector2D} _position
 */
Unit.prototype.moveTo=function(_position){
    if (!_position instanceof Vector2D) {
        throw "El parámetro 'map' debe ser un objeto válido 'Vector2D'.";
    }
    this.stop();
    this.addDestination(_position);
    return true;
};

/**
 * Realiza un ataque a la posición
 * @param {Vector2D} _position
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
 * @returns {Vector2D} con la posición actual
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
 * @type {Vector2D}
 */
Unit.prototype.checkCollisionInPosition=function(_position){
    return this.game.checkPosition(_position.floor());

};

module.exports = Unit;