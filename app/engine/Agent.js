"use strict";
var Unit,Action,Angle, _,Vector2D,Bullet,Util, Logger;

_ = require("underscore");
Vector2D = require("./vendor/Vector2D");
Angle = require("./vendor/Angle");
Bullet = require("./Bullet");
Util=require("./vendor/Util");
Action=require("./Action");
Logger = require('../../logger.js');

function Agent(_game,_teamId){
	this.game=_game;
	this.teamId=_teamId;

	this.unitsAction=[];

}

Agent.prototype.initialize=function(){
	var context=this;
	var defaultAction=new Action(new Angle(2*Math.PI*Math.random(),true),new Angle(2*Math.PI*Math.random(),true));
	_.each(this.game.teams[this.teamId].units,function(_unit,_idx){
		context.unitsAction[_idx]=defaultAction;
	});
};


Agent.prototype.getAction=function(){
	return this.unitsAction;
};


/**
 * Mueve la unidad
 *
 * Move the unit
 * @param {Unit} _unit
 */
Agent.prototype.move = function(){

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


            if(this.path.length===0){
					Logger.log();
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


module.exports=Agent;
