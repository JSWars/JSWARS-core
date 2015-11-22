	/**
	 * This method will be called before first tick.
	 * Here you can crete your working context.
	 * All variables will be persistent between ticks
	 */
	function init() {




	}

	/**
	 * This method will be called each game tick.
	 * Here you can do anything you want to calculate your actions on current tick.
	 * You can register actions in any point of the method
	 */
	function tick() {

	var position= new Utils.Vector2D(0,0);
	for(var i=0;i<me.units.length;i++){
		if(me.units[i].alive==true){
			position=enemy.units[i].position;
				output.unit(i).addAction("moveTo", enemy.units[i].position);
				output.unit(i).addAction("attackTo", enemy.units[i].position);
		}

	}






}
