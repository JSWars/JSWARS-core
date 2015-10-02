function init(){
//nothing to init
}

function tick(){

	var randomX = Math.random(game.colMap[0].length);
	var randomY = Math.random(game.colMap.length);

	output.unit(0).addAction("moveTo", new Utils.Angle(randomX, randomY));
}
