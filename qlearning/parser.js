
var jsonfile = require('jsonfile');
var util = require('util');
var fs = require('fs');
var Vector2D=require('./Vector2D');

function State(name){
	this.name = name;
	this.actions = {};
	this.actionsList = [];
}

State.prototype.addAction = function (nextState, reward, actionName){
	var action =  {
		name: actionName===undefined ? nextState : actionName,
		nextState: nextState,
		reward: reward
	};
	this.actionsList.push(action);
	this.actions[action.name] = action;
};

State.prototype.randomAction = function(){
	return this.actionsList[~~(this.actionsList.length * Math.random())];
};

function QLearner(gamma){
	this.gamma = gamma || 0.8;
	this.rewards = {};
	this.states = {};
	this.statesList = [];
	this.currentState = null;
}

QLearner.prototype.add = function (from, to, reward, actionName){
	if (!this.states[from]) this.addState(from);
	if (!this.states[to]) this.addState(to);
	this.states[from].addAction(to, reward, actionName);
};

QLearner.prototype.addState = function (name){
	var state = new State(name);
	this.states[name] = state;
	this.statesList.push(state);
	return state;
};

QLearner.prototype.setState = function (name){
	this.currentState = this.states[name];
	return this.currentState;
};

QLearner.prototype.getState = function (){
	return this.currentState && this.currentState.name;
};

QLearner.prototype.randomState = function(){
	return this.statesList[~~(this.statesList.length * Math.random())];
};

QLearner.prototype.optimalFutureValue = function(state){
	var stateRewards = this.rewards[state];
	var max = 0;
	for (var action in stateRewards){
		if (stateRewards.hasOwnProperty(action)){
			max = Math.max(max, stateRewards[action] || 0);
		}
	}
	return max;
};

QLearner.prototype.step = function (){
	this.currentState || (this.currentState = this.randomState());
	var action = this.currentState.randomAction();
	if (!action) return null;
	this.rewards[this.currentState.name] || (this.rewards[this.currentState.name] = {});
	this.rewards[this.currentState.name][action.name] = (action.reward || 0) + this.gamma * this.optimalFutureValue(action.nextState);
	return this.currentState = this.states[action.nextState];
};

QLearner.prototype.learn = function(steps){
	steps = Math.max(1, steps || 0);
	while (steps--){
		this.currentState = this.randomState();
		this.step();
	}
};

QLearner.prototype.bestAction = function(state){
	var stateRewards = this.rewards[state] || {};
	var bestAction = null;
	for (var action in stateRewards){
		if (stateRewards.hasOwnProperty(action)){
			if (!bestAction){
				bestAction = action;
			} else if ((stateRewards[action] == stateRewards[bestAction]) && (Math.random()>0.5)){
				bestAction = action;
			} else if (stateRewards[action] > stateRewards[bestAction]){
				bestAction = action;
			}
		}
	}
	return bestAction;
};

QLearner.prototype.knowsAction = function(state, action){
	return (this.rewards[state] || {}).hasOwnProperty(action);
};

QLearner.prototype.applyAction = function(actionName){
	var actionObject = this.states[this.currentState.name].actions[actionName];
	if (actionObject){
		this.currentState = this.states[actionObject.nextState];
	}
	return actionObject && this.currentState;
};

QLearner.prototype.runOnce = function(){
	var best = this.bestAction(this.currentState.name);
	var action = this.states[this.currentState.name].actions[best];
	if (action){
		this.currentState = this.states[action.nextState];
	}
	return action && this.currentState;
};


var file="battle.json";


var learner = new QLearner(0.8);
var centroides=[];
centroides.push([   5.607,   -1.089, 8000.000, 8000.000]);
centroides.push([  -1.421,    3.114, 8000.000, 8000.000]);
centroides.push([   1.371,   -0.596, 8000.000, 8000.000]);
centroides.push([8000.000, 8000.000,    0.979,   -1.359]);
centroides.push([  -1.455,   -1.257, 8000.000, 8000.000]);
centroides.push([  -0.063,    0.233, 8000.000, 8000.000]);
centroides.push([8000.000, 8000.000, 8000.000, 8000.000]);
centroides.push([  -2.322,   -6.415, 8000.000, 8000.000]);
centroides.push([   0.292,   -0.245,    1.178,   -0.740]);
centroides.push([  -1.593,    0.289, 8000.000, 8000.000]);
centroides.push([   2.715,    6.011, 8000.000, 8000.000]);
centroides.push([   3.647,    2.134, 8000.000, 8000.000]);
centroides.push([   1.696,    1.306, 8000.000, 8000.000]);
centroides.push([   1.965,   -6.459, 8000.000, 8000.000]);
centroides.push([  -0.015,   -0.024, 8000.000, 8000.000]);
centroides.push([   0.092,   -0.360, 8000.000, 8000.000]);
centroides.push([  -2.419,    5.827, 8000.000, 8000.000]);
centroides.push([  -4.767,   -1.382, 8000.000, 8000.000]);
centroides.push([   1.323,    2.031,   -2.388,    1.862]);
centroides.push([   1.408,   -2.130, 8000.000, 8000.000]);
centroides.push([   1.408,   -2.130, 8000.000, 8000.000]);
centroides.push([   1.408,   -2.130, 8000.000, 8000.000]);
centroides.push([   1.408,   -2.130, 8000.000, 8000.000]);
centroides.push([   1.408,   -2.130, 8000.000, 8000.000]);
centroides.push([   1.408,   -2.130, 8000.000, 8000.000]);
centroides.push([   1.408,   -2.130, 8000.000, 8000.000]);





function getDistance(array1,array2){

	var acum=0;
	for(var i=0;i<array1.length;i++){
		acum+=Math.pow(array1[i]-array2[i],2);
	}

	return Math.sqrt(acum);
}

function getEstado(array){
	var distanciaTemporal=80000000;
	var centroideAsignado=2;

	for(var i=0;i<centroides.length;i++){
		var distance=getDistance(array,centroides[i]);

		if(distance<distanciaTemporal){
			centroideAsignado=i;
			distanciaTemporal=distance;
		}
	}
	return centroideAsignado;
}


var readFile=function(file){

	main(jsonfile.readFileSync(file));
};

var writeFile=function(filename,texto){
//ESCRIBIMIOS FICHERO
fs.writeFile(filename, texto, function(err) {
	if(err) {
		return console.log(err);
	}

	console.log("The file was saved!");
});
};

var writeJSON=function(filename,obj){
	jsonfile.writeFile(filename,obj,function(err){
		console.log(err);
	});
}

var unidadCercana=function(frameActual,_unit,idTeam){
	var unit=frameActual.teams[idTeam].units[_unit];

	var unitPos=new Vector2D(unit.position.x,unit.position.y);
	var posEnemyNear=new Vector2D(8000,8000);
	var radioSonar=8;

	var Enemy={
		unit:undefined,
		pos:posEnemyNear
	};

	for(var i=0;i<frameActual.teams[(idTeam+1)%2].units.length;i+=1){
		var enemyUnit=frameActual.teams[(idTeam+1)%2].units[i];
		var enemyUnitPos=new Vector2D(enemyUnit.position.x,enemyUnit.position.y);
		if(enemyUnit.alive==true){

			var dist=enemyUnitPos.subtract(unitPos).mag();
			if(dist<radioSonar&&dist<posEnemyNear.mag()){
				posEnemyNear=enemyUnitPos.subtract(unitPos).clone();
				Enemy.unit=enemyUnit;
				Enemy.pos=posEnemyNear.clone();
			}
		}
	}


	return Enemy;
};



var bulletClose=function(frameActual,_unit,idTeam){
	var unit=frameActual.teams[idTeam].units[_unit];

	var unitPos=new Vector2D(unit.position.x,unit.position.y);
	var posBulletNear=new Vector2D(8000,8000);
	var radioSonar=5;
	for(var bulletKey in frameActual.bullets){
		var bullet=frameActual.bullets[bulletKey];
		if(bullet.teamId==idTeam){
			continue;
		}

		var enemyBulletPos=new Vector2D(bullet.position.x,bullet.position.y);


		var dist=enemyBulletPos.subtract(unitPos).mag();
		if(dist<radioSonar&&dist<posBulletNear.mag()){
			posBulletNear=enemyBulletPos.subtract(unitPos).clone();
		}
	}

	return posBulletNear;
};

var enemigosVivos= function (frameActual,idTeam) {
	var count=0;
	for(var i=0;i<frameActual.teams[(idTeam+1)%2].units.length;i+=1){
		if(frameActual.teams[(idTeam+1)%2].units[i].alive==true){
			count+=1;
		}
	}
	return count;
};


//main
var wekaData="";

wekaData+="@relation jswars\n";
wekaData+="@attribute prevenX numeric\n";
wekaData+="@attribute prevenY numeric\n";
wekaData+="@attribute prevbulX numeric\n";
wekaData+="@attribute prevbulY numeric\n";
wekaData+="@attribute action {atacar,esquivar,avanzar, atacarAvanzar,atacarEsquivar}\n";
wekaData+="@attribute enX numeric\n";
wekaData+="@attribute enY numeric\n";
wekaData+="@attribute bulX numeric\n";
wekaData+="@attribute bulY numeric\n";
wekaData+="@attribute rec numeric\n";
wekaData+="@data\n";


var main = function(objtFile){

	var rawBattle=objtFile;
	var lapso=10;


	for(var i=lapso;i<rawBattle.frames.length;i+=1)
	{
		var frameActual = rawBattle.frames[i];
		var framePrevious = rawBattle.frames[i-lapso];

		for(var j=0;j<2;j+=1){


			for(var un=0;un<frameActual.teams[j].units.length;un+=1){
				var en=unidadCercana(frameActual,un,j);

				var bu=bulletClose(frameActual,un,j);

				var enprev=unidadCercana(framePrevious,un,j);

				var buprev=bulletClose(framePrevious,un,j);


				//calcular accion

				var attack=false;
				if(enprev.unit&&en.unit)
				{
					if(enprev.unit.health-en.unit.health>0){
						attack=true;
					}
				}

				var avanzar=false;
				var esquivar=false;
				if(enprev.unit&&en.unit){
					if(enprev.pos.mag()-en.pos.mag()>0)
					{
						avanzar=true;
					}else{
						esquivar=true;
					}
				}else{
					avanzar = true;
				}

				var accion="atacar";
				if(attack){

					if (avanzar){
						accion="atacarAvanzar";
					}

					if(esquivar){
						accion="atacarEsquivar";
					}


				}else if(esquivar){
					accion="esquivar";
				}else if(avanzar){
					accion="avanzar";
				}

				//calcular recompensa

				var recompensa=0;

				var recEnMuerto=10;
				var recQuitarVida=5;
				var recAvanzar=1;

				var enemigos=enemigosVivos(frameActual,j);
				var enemigosAnt=enemigosVivos(framePrevious,j);

				recompensa+=(enemigosAnt-enemigos)*recEnMuerto;

				var aliados=enemigosVivos(frameActual,(j+1)%2);
				var aliadosAnt=enemigosVivos(framePrevious,(j+1)%2);

				recompensa-=(aliadosAnt-aliados)*recEnMuerto;

				var healthquitada=0;
				if(enprev.unit&&en.unit) {

					healthquitada = enprev.unit.health - en.unit.health;
				}
				if(healthquitada>0){
					recompensa+=recQuitarVida;
				}

				if(enprev.pos.mag()-en.pos.mag()>0){
					recompensa+=recAvanzar;
				}





				wekaData+=enprev.pos.x+","+enprev.pos.y+","+buprev.x+","+buprev.y+",";

				wekaData+=accion+",";
				wekaData+=en.pos.x+","+en.pos.y+","+bu.x+","+bu.y+",";

				wekaData+=recompensa+"\n";


				var estado=getEstado([enprev.pos.x,enprev.pos.y,buprev.x,buprev.y]);;
				var estado2=getEstado([en.pos.x,en.pos.y,bu.x,bu.y]);

				learner.add("s"+estado, "s"+estado2, recompensa, accion);
			}
		}



	}



};

readFile("battle.json");
readFile("battle2.json");
readFile("battle3.json");
readFile("battle4.json");
readFile("battle5.json");
readFile("battle6.json");
learner.learn(1000);

writeJSON("qt.json",learner.rewards);

writeFile("out.arff",wekaData);
