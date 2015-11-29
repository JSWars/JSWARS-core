
var attack_this_unit;

function init() {

	attack_this_unit=Math.floor(Math.random()*4);



}

/**
 * This method will be called each game tick.
 * Here you can do anything you want to calculate your actions on current tick.
 * You can register actions in any point of the method
 */
function tick() {

	var e_position= new Utils.Vector2D(0,0);
	var u_position= new Utils.Vector2D(0,0);
	for(var i=0;i<me.units.length;i++){
		if(me.units[i].alive==true){
			e_position=enemy.units[attack_this_unit].position;
			u_position=me.units[i].position;

			if(u_position.subtract(e_position).mag()>3) {
				output.unit(i).addAction("moveTo", e_position);
			}
			output.unit(i).addAction("attackTo", e_position);
		}

	}






}
