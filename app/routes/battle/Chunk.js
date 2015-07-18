var FS, Battle, BattleFrame, Mongoose;
FS = require('fs');

Battle = require('../../model/Battle');
BattleFrame = require('../../model/BattleFrame');
Mongoose = require('mongoose');

function Map(req, res) {
	var chunkId, chunkSize, chunkStartFrame, chunkEndFrame;

	chunkId = req.params.chunkId;
	chunkSize = 300;//TOD O QUITAR HARCODED

	chunkStartFrame = chunkId * chunkSize;
	chunkEndFrame = chunkStartFrame + chunkSize;


	//FS.readFile('app/resources/chunk.json', function (err, data) {
	//	if (err) throw err;
	//	res.json(JSON.parse(data));   {battle: "55aa34c9a9c9c6a0035c6f1a"}
	//});


	Battle.findOne({
		//'frame.index': {$gte: chunkStartFrame, $lt: chunkEndFrame}
	}, {}, {short: {'moment': -1}})
		.populate('frames')
		.exec(function (err, battle) {
			res.json(battle.frames);
		});
}
module.exports = Map;
