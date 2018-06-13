var jsonfile = require('jsonfile');
var util = require('util');
var fs = require('fs');
var Vector2D=require('./Vector2D');
var Qlearner = require('./q-learning');


//VARIABLES

var lapso=10;

//READ BATTLES
var filename="";

var battles={};

var battle=jsonfile.readFileSync(filename);


battles.push(battle);


//WEKA DATA
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

function getUnitsOrderByDistance(_frame,_teamId,_position){



	for(var i=0;i<_frame.teams[_teamId].units.length;i+=1){
		var enemyUnit=_frame.teams[_teamId].units[i];
		var enemyUnitPos=new Vector2D(enemyUnit.position.x,enemyUnit.position.y);
		if(enemyUnit.alive==true){

			var dist=enemyUnitPos.subtract(_position).mag();
			if(dist<radioSonar&&dist<posEnemyNear.mag()){
				posEnemyNear=enemyUnitPos.subtract(_position).clone();
				Enemy.unit=enemyUnit;
				Enemy.pos=posEnemyNear.clone();
			}
		}
	}


	return Enemy;
}

function getBulletOrderByDistance(_frame,_teamId,_position){
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
}

function getNumberOfUnitsAliveByTeam(_frame,_teamId){
	var count=0;
	for(var i=0;i<_frame.teams[_teamId].units.length;i+=1){
		if(_frame.teams[_teamId].units[i].alive===true){
			count+=1;
		}
	}
	return count;
}

function calculateAction(frame,frameFuture){

}

function calculateReward(frame,frameFuture){



}

//FOR EACH BATTLE
for(var battleKey in battles){
	var singleBattle=battle[battleKey];

	//FOR EACH BATTLE FRAME
	for(var frame=0;frame<singleBattle.frames.length;frame+=1){

		//FOR EACH TEAM
		for(var teamKey in singleBattle.frames[frame].teams){
			var team=singleBattle.frames[frame].teams;
			//FOR EACH UNIT
			for(var unitKey in team){
				var unit=team.unit[unitKey];


				//OBTENER ATRIBUTOS


				//OBTENER ACCIONES


				//CALCULAR RECOMPENSA
				calculateReward(frame,frameFuture);

				//FICHERO WEKA

			}

		}
	}

}
