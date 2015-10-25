/**
 * This method will be called before first tick.
 * Here you can crete your working context.
 * All variables will be persistent between ticks
 */
function init() {
	//Utils.Vector2D(x,y)
	//game
}

/**
 * This method will be called each game tick.
 * Here you can do anything you want to calculate your actions on current tick.
 * You can register actions in any point of the method
 */
function tick() {
	var randomX = Math.random(game.colMap[0].length);
	var randomY = Math.random(game.colMap.length);

	output.unit(0).addAction("moveTo", new Utils.Vector2D(randomX, randomY));

	var randomX = Math.random(game.colMap[0].length);
	var randomY = Math.random(game.colMap.length);

	/*
	 The correct way to register an output action for a unit is:

	 output.unit(_unitId).addAction(_action, _position);

	 _unitId: Target unit identifier
	 _action: Name of the action that we want to apply to the unit. Available actions are:
	 * attackTo: Shoot to a position
	 * moveTo: Move to a positions
	 _position: Target position of the action registered

	 */

	output.unit(0).addAction("attackTo", new Utils.Vector2D(randomX, randomY));
}

