/**
 * Created by Luiss_000 on 13/12/2015.
 */

var attack_this_unit;
var time=0;
var changeDir=true;

function init() {

	attack_this_unit=Math.floor(Math.random()*4);
}

/**
 * This method will be called each game tick.
 * Here you can do anything you want to calculate your actions on current tick.
 * You can register actions in any point of the method
 */
function tick() {
	time++;

	if(enemy.units[attack_this_unit].alive==false){

		attack_this_unit=Math.floor(Math.random()*4);
	}

	var e_position= new Utils.Vector2D(0,0);
	var u_position= new Utils.Vector2D(0,0);

	var min_distance=2+Math.random()*10;


	for(var i=0;i<me.units.length;i++){
		if(me.units[i].alive==true){
			e_position=enemy.units[attack_this_unit].position;
			u_position=me.units[i].position;


			var path=game.map.getPath(u_position,e_position);


			if(u_position.subtract(e_position).mag()>min_distance) {
				if(path[1]!==undefined)
				{
					var nextPos=new Utils.Vector2D(path[1][0]+0.5,path[1][1]+0.5);

					output.unit(i).addAction("moveTo", nextPos);
				}else{
					output.unit(i).addAction("moveTo", e_position);
				}



			}else{
				var enVec=e_position.subtract(u_position);


				var perVec=new Utils.Vector2D(-enVec.y,enVec.x);

				if(time%10==0){
					changeDir=!changeDir;
				}

				if(changeDir){
					perVec=new Utils.Vector2D(enVec.y,-enVec.x);
				}

				var direc=u_position.add(perVec);
				output.unit(i).addAction("moveTo", direc);

			}
			output.unit(i).addAction("attackTo", e_position);
		}

	}






}
