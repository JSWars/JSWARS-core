/**
 * This method will be called before first tick.
 * Here you can crete your working context.
 * All variables will be persistent between ticks
 */
function init() {

	/*
	 * The "Utils" object provides some useful methods.
	 * This object is not writable
	 */

	//Create a vector using Vector2D Util
	var vectorSample = Utils.Vector2d(1, 2);

	/*
	 * The global object "game" has all the information available for current game state,
	 * This object is updated every tick.
	 */


	//Loading the colmap
	var colmap = game.colMap;

	//Colmap width
	var colmapWidth = colmap.length;

	//Colmap height = colmap
	var colmapHeight = colmap[0].length;

	//Iterating over teams
	for (var i = 0; i < game.teams.length; i++) {
		var team = game.teams.length;
	}

	//Iterating over bullets
	for (var o = 0; o < game.bullets.length; o++) {
		var bullet = game.bullets.length;
	}


	/**
	 * GAME OBJECT EXAMPLE
	 * {
	 *	  "teams": [
	 *		 {
	 *			"id": 0,
	 *			"color": "#049110",
	 *			"units": [
	 *			  {
	 *				 "health": 100,
	 *				 "alive": true,
	 *				 "position": {
	 *					"x": 2,
	 *					"y": 2
	 *				 },
	 *				 "radius": 0.2
	 *			  }
	 *			]
	 *		 },
	 *		 {
	 *			"id": 1,
	 *			"color": "#7CACC5",
	 *			"units": [
	 *			  {
	 *				 "health": 100,
	 *				 "alive": true,
	 *				 "position": {
	 *					"x": 10,
	 *					"y": 2
	 *				 },
	 *				 "radius": 0.2
	 *			  }
	 *			]
	 *		 }
	 *	  ],
	 *	  "bullets": [],
	 *	  "colMap": [...] //Double input array
	 *	  ]
	 *	}
	 */


	/*
	 * The global object "me" is a shortcut to your team.
	 * This allows you to access to your team data easely
	 */

	var myTeamidentifier = me.id;

}

/**
 * This method will be called each game tick.
 * Here you can do anything you want to calculate your actions on current tick.
 * You can register actions in any point of the method
 */
function tick() {

	/**
	 * The correct way to register an output action for a unit is:
	 *
	 * output.unit(_unitId).addAction(_action, _position);
	 *
	 * 	_unitId: Target unit identifier
	 * 	_action: Name of the action that we want to apply to the unit. Available actions are:
	 * 		* attackTo: Shoot to a position
	 * 		* moveTo: Move to a positions
	 * 	_position: Target position of the action registered
	 *
	 */

	var randomX = Math.random(game.colMap[0].length);
	var randomY = Math.random(game.colMap.length);

	output.unit(0).addAction("moveTo", new Utils.Vector2D(randomX, randomY));

	var randomX = Math.random(game.colMap[0].length);
	var randomY = Math.random(game.colMap.length);
	output.unit(0).addAction("attackTo", new Utils.Vector2D(randomX, randomY));
}

