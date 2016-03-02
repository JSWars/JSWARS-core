/**
 * Created by Luiss_000 on 21/02/2016.
 */
/**
 * Created by Luiss_000 on 13/12/2015.
 */

var attack_this_unit;
var time=0;
var changeDir=true;

var centroides=[];
/// qlearninnnngggg

function QLearner(){
	this.rewards = {"s5":{"avanzar":13.272783360000004,"esquivar":15.13963653722901,"atacarAvanzar":15.340979200000003,"atacarEsquivar":13.151237971148802},"s11":{"esquivar":25.446004064256005,"atacarAvanzar":31.807505080320006,"avanzar":26.446004064256005},"s12":{"esquivar":25.446004064256005,"avanzar":16.13963653722901},"s0":{"esquivar":28.909824000000004,"avanzar":28.716803251404805,"atacarEsquivar":36.137280000000004,"atacarAvanzar":11.152000000000001},"s7":{"avanzar":35.365442601123846,"esquivar":34.365442601123846,"atacarAvanzar":16.240000000000002,"atacarEsquivar":42.95680325140481},"s1":{"esquivar":19.648633841228193,"avanzar":30.156803251404803,"atacarAvanzar":24.676224,"atacarEsquivar":23.56079230153524},"s18":{"esquivar":19.7409792,"avanzar":20.648633841228193,"atacarEsquivar":18.345280000000002,"atacarAvanzar":31.807505080320006},"s13":{"avanzar":14.459534504919043,"esquivar":13.459534504919043,"atacarEsquivar":16.824418131148803},"s19":{"esquivar":26.173442601123845,"atacarEsquivar":32.716803251404805,"avanzar":27.173442601123845},"s9":{"esquivar":23.325442601123843,"avanzar":21.356803251404806,"atacarAvanzar":31.807505080320006,"atacarEsquivar":23.200990376919048},"s17":{"esquivar":22.973442601123846,"avanzar":28.716803251404805,"atacarAvanzar":17.789047463936},"s14":{"esquivar":10.667475543628186,"avanzar":11.667475543628186,"atacarEsquivar":-4.332524456371814,"atacarAvanzar":13.334344429535232},"s15":{"avanzar":20.08700326471926,"esquivar":17.655682089420328,"atacarEsquivar":9.640604160000002,"atacarAvanzar":22.06960261177541},"s2":{"esquivar":26.173442601123845,"avanzar":36.716803251404805,"atacarEsquivar":40.716803251404805,"atacarAvanzar":44.646004064256005},"s10":{"esquivar":18.074226688000003,"avanzar":13.862004064256002,"atacarAvanzar":22.592783360000002},"s3":{"avanzar":7.097346080899074},"s8":{"avanzar":19.92454567153626,"esquivar":27.716803251404805,"atacarAvanzar":13.367930536919042,"atacarEsquivar":32.259381350400005},"s4":{"esquivar":27.716803251404805,"avanzar":28.716803251404805,"atacarAvanzar":34.646004064256005},"s16":{"avanzar":27.074226688,"atacarAvanzar":32.59278336,"esquivar":26.074226688,"atacarEsquivar":23.074226688000003},"s6":{"avanzar":5.677876864719259}}


}

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


var learner=new QLearner();
/// qkwjekrljwelr



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

function getCloseBullet(position){
	var selectedBullet = undefined;
	var minimumDistanceBullet = undefined;

	var bulletDef=new Utils.Vector2D(8000,8000);

	for (var u = 0; u < game.bullets.length; u++) {
		if(game.bullets[u].teamId==me.id){
			continue;
		}

		var bullet = game.bullets[u];
		var bulletPosition = bullet.position;
		var currentBulletDistance = bulletPosition.subtract(position).mag();

		if (currentBulletDistance < 4) {
			if (selectedBullet === undefined || ( minimumDistanceBullet > currentBulletDistance)) {
				minimumDistanceBullet = currentBulletDistance;
				selectedBullet = u;
				bulletDef=bullet;
			}
		}
	}

	return bulletDef;

}

function getCloseEnemy(position){
	var mag=80000;

	var enPosition=new Utils.Vector2D(8000,8000);

	for(var j=0;j<enemy.units.length;j++) {
		if (enemy.units[j].alive == true) {
			if(position.subtract(enemy.units[j].position).mag()<mag){
				enPosition=enemy.units[j].position.clone();
				mag=position.subtract(enemy.units[j].position).mag();
			}
		}
	}

	return enPosition;
}


function getDistance(array1,array2){

	var acum=0;
	for(var i=0;i<array1.length;i++){
		acum+=Math.pow(array1[i]-array2[i],2);
	}

	return Math.sqrt(acum);
}


function init() {
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


}
/**
 * This method will be called each game tick.
 * Here you can do anything you want to calculate your actions on current tick.
 * You can register actions in any point of the method
 */
function tick() {
	var e_position= new Utils.Vector2D(0,0);
	var u_position= new Utils.Vector2D(0,0);

	var bullet_position=new Utils.Vector2D(0,0);


	for(var i=0;i<me.units.length;i++) {
		if (me.units[i].alive == true) {

			u_position=me.units[i].position;
			e_position=enemy.units[i].position;

			var path=Utils.map.getPath(u_position,e_position);

			var enePosRelative=e_position.subtract(u_position);

			bullet_position=getCloseBullet(u_position);

			var centroide=getEstado([enePosRelative.x,enePosRelative.y,bullet_position.x,bullet_position.y]);

			var action=learner.bestAction("s"+centroide);


			if(action=="avanzar"){

				if(path[1]!==undefined)
				{
					var nextPos=new Utils.Vector2D(path[1][0]+0.5,path[1][1]+0.5);

					output.unit(i).addAction("moveTo", nextPos);
				}else{
					output.unit(i).addAction("moveTo", e_position);
				}

			}else if(action=="atacarAvanzar"){

				if(path[1]!==undefined)
				{
					var nextPos=new Utils.Vector2D(path[1][0]+0.5,path[1][1]+0.5);

					output.unit(i).addAction("moveTo", nextPos);
				}else{
					output.unit(i).addAction("moveTo", e_position);
				}

				output.unit(i).addAction("attackTo", e_position);

			}else if(action=="atacarEsquivar"){

				output.unit(i).addAction("moveTo", u_position.add(new Utils.Vector2D(bullet_position.y,-bullet_position.x)));
				output.unit(i).addAction("attackTo", e_position);
			}else if(action=="esquivar"){
				output.unit(i).addAction("moveTo", u_position.add(new Utils.Vector2D(bullet_position.y,-bullet_position.x)));
			}else if(action=="atacar"){
				output.unit(i).addAction("attackTo", e_position);
			}
		}
	}





}

