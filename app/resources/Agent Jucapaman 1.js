/**
 * Created by Luiss_000 on 12/01/2016.
 */

function init() {

}

function tick() {


	var move_to_position= new Utils.Vector2D(0,0);
	for(var i=0;i<me.units.length;i++){
		output.unit(i).addAction("moveTo", move_to_position);
	}
}
