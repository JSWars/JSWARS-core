"use strict";
var _,Vector2D;

_ = require("underscore");
Vector2D = require("./vendor/Vector2D");

var TYPE={
    RANGE:0,
    BODY:1
};
/**
 * Default properties
 *
 */
var defaultProperties = {
    position:null,//OBLIGATORIO
    radius:0.1,
    speed:0.1,
    health:5,
    armor:0,
    damage:1,
    fireRate:10,
    fireDistance:5,
    type:TYPE.RANGE
};



/**
 * Representa un Tanque.
 * @constructor
 * @param {Game} _game Instancia del juego
 * @param {Team} _team Equipo enemigo.
 * @param _properties
 * @constructor
 */
//function Unit(_game,_position, _speed, _armor, _damage, _fireRate, _fireDistance) {
function Unit(_game,_team,_properties){
    /**
     * Instancia del juego
     * @type {Game}
     */
    this.game=_game;

    /**
     * Instancia del equipo al que pertenece la unidad
     */
    this.team=_team;


    /**
     * Indica si la unidad está viva
     * @type {boolean}
     */
    this.alive = true;


    /**
     * Attack cooldown of the unit, set the firerate when shoot and decrease 1 per tick
     * @type {number}
     */
    this.cooldown=0;


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
     */

    /**
     * Posición de la unidad
     *
     * Units position
     * @type {Vector2D}
     */
    this.position = (_properties.position)?_properties.position:defaultProperties.position;


    /**
     * Radio de la unidad
     * Unit's radius for collisions and future implementations
     * @type {number}
     */
    this.radius = (_properties.radius)?_properties.radius:defaultProperties.radius;


    /**
     * Velocidad de movimiento de la unidad
     * @type {number}
     */
    this.speed = (_properties.speed)?_properties.speed:defaultProperties.speed;

    /**
     * Armadura de la unidad
     * @type {number}
     */
    this.armor = (_properties.armor)?_properties.armor:defaultProperties.armor;


    /**
     * Daño de la unidad
     * @type {number}
     */
    this.damage = (_properties.damage)?_properties.damage:defaultProperties.damage;


    /**
     * Cadencia de tiro
     * Fire Rate of the unit
     * @type {number}
     */
    this.fireRate = (_properties.fireRate)?_properties.fireRate:defaultProperties.fireRate;


    /**
     * Alcance del disparo
     * @type {number}
     */
    this.fireDistance  =(_properties.fireDistance)?_properties.fireDistance:defaultProperties.fireDistance;


    /**
     * Health of the unit
     * @type {number}
     */
    this.health = (_properties.health)?_properties.health:defaultProperties.health;



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
     * @type {Vector2D}
     */
    this.attackTo = null;

}

/**
 *
 */
Unit.prototype.createCollSphere=function(){

    var angle= (2.0 * Math.PI) / this.numPointsCollSphere;

    this.collSphereRelative[0]=new Vector2D(1,0);
    for(var i=1;i<this.numPointsCollSphere;i+=1){
        this.collSphereRelative[i]=this.collSphereRelative[i-1];
        this.collSphereRelative[i]=this.collSphereRelative[i].rotate(angle);
    }

};

/**
 * Attack to position
 * @param {Vector2D} _position
 */
Unit.prototype.addAttackOrder = function(_position){
    if (!Vector2D instanceof Unit) {
        throw "El parámetro 'map' debe ser un objeto válido 'Vector2D'.";
    }
    this.attackTo=_position;
};

/**
 *
 */
Unit.prototype.attack = function(){
    if(this.cooldown===0&&this.attackTo!==null){

    }
};


/**
 *
 */
Unit.prototype.update = function(){
    this.attack();
    this.move();
};

/**
 * Deal _damage to the unit. Set alive to false if the health<=0
 * @param {number} _damage
 */
Unit.prototype.hurt = function(_damage){

    this.health-=_damage;
    if(this.health<=0){
        this.alive=false;
    }

};



/**
 * Mueve la unidad
 *
 * Move the unit
 * @param {Unit} _unit
 */
Unit.prototype.move = function(){

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
            this.path=this.game.map.getPath(this.position.clone().floor(),this.moveTo[0].clone());

            if(this.path.length===0){
                console.log("ERROR DE LA MUERTEEEEE");
            }
        }

        if(this.path.length>0){
            var nextPos,vNextPos;
            /**
             * Obtenemos la siguiente posición del path que está a la vista.
             * @type {Vector2D}
             */
            nextPos = new Vector2D(this.path[0][0]+0.5,this.path[0][1]+0.5);

            //CALCULAR SIGUIENTE POSICION DEL PATH QUE checkObsFreeDistance !=-1
            vNextPos = nextPos.subtract(this.position);

            //Si con moveDistance llegamos al siguiente path avanzamos hasta el siguiente path.
            if(vNextPos.mag()<moveDistance) {
                //Asignamos la nueva posicion
                this.position = new Vector2D(this.path[0][0]+0.5, this.path[0][1]+0.5);
                //Eliminamos la posición del path
                this.path.splice(0, 1);


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
    return this.game.checkPosition(_position);

};

module.exports = Unit;