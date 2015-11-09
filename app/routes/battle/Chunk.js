var FS, Battle, BattleFrame, Mongoose;
FS = require('fs');

Battle = require('../../model/Battle');
BattleFrame = require('../../model/BattleFrame');
Mongoose = require('mongoose');

function Map(req, res) {
	var chunkId, chunkSize, chunkStartFrame, chunkEndFrame;

	chunkId = req.params.chunkId;
	chunkSize = 300;//TODO QUITAR HARCODED

	chunkStartFrame = chunkId * chunkSize;
	chunkEndFrame = chunkStartFrame + chunkSize;


	//FS.readFile('app/resources/chunk.json', function (err, data) {
	//	if (err) throw err;
	//	res.json(JSON.parse(data));   {battle: "55aa34c9a9c9c6a0035c6f1a"}
	//});


	Battle.findOne({})
		.sort({'moment': -1})
		.exec(function (err, battle) {
			BattleFrame.find({
				battle: battle._id,
				index: {$gte: chunkStartFrame, $lt: chunkEndFrame}
			})
				.sort({'index': 1})
				.select({data: 1})
				.exec(function (err, frames) {
					res.json(frames);
				});

		});
}
module.exports = Map;
