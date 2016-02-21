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
};

function getDistance(array1,array2){

	var acum=0;
	for(var i=0;i<array1.length;i++){
		acum+=Math.pow(array1[i]-array2[i],2);
	}

	return Math.sqrt(acum);
}


function init() {
	centroides.push([   1.005,   -1.347, 8000.000, 8000.000]);
	centroides.push([  -1.265,   -0.141, 8000.000, 8000.000]);
	centroides.push([8000.000, 8000.000, 8000.000, 8000.000]);
	centroides.push([   1.432,    1.125, 8000.000, 8000.000]);
	centroides.push([  -5.376,   -2.594, 8000.000, 8000.000]);
	centroides.push([   0.368,    2.141,   -2.023,    0.968]);
	centroides.push([   6.101,    0.446, 8000.000, 8000.000]);
	centroides.push([  -0.693,   -1.068,    0.664,   -1.598]);
	centroides.push([   1.553,    0.241,    1.990,   -0.037]);
	centroides.push([  -0.916,    5.034, 8000.000, 8000.000]);


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
			e_position=getCloseEnemy(u_position);

			var enePosRelative=e_position.subtract(u_position);

			bullet_position=getCloseBullet(u_position);

			var centroide=getEstado([enePosRelative.x,enePosRelative.y,bullet_position.x,bullet_position.y]);



		}
	}





}

function getCloseBullet(position){
	var selectedBullet = undefined;
	var minimumDistanceBullet = undefined;

	var bulletDef=Utils.Vector2D(8000,8000);

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
