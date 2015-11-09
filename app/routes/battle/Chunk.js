var FS, Battle, BattleFrame, Mongoose, Logger;
FS = require('fs');

Battle = require('../../model/Battle');
BattleFrame = require('../../model/BattleFrame');
Mongoose = require('mongoose');
Logger = require('../../logger.js');


function Chunk(req, res) {
	var chunkId, battleId, chunkSize, chunkStartFrame, chunkEndFrame;

	chunkId = req.params.chunkId;
	battleId = req.params.id;
	chunkSize = 300;

	chunkStartFrame = chunkId * chunkSize;
	chunkEndFrame = chunkStartFrame + chunkSize;

	Logger.log('debug', 'Requested chunk ' + chunkId + ' for battle ' + battleId);

	Logger.log('debug', 'Start frame ' + chunkStartFrame);
	Logger.log('debug', 'End frame ' + chunkEndFrame);

	BattleFrame.find({
		battle: battleId,
		index: {$gt: chunkStartFrame, $lte: chunkEndFrame}
	})
		.sort({'index': 1})
		.select({data: 1})
		.exec(function (err, frames) {
			if (err) {
				Logger.log('error', 'Battle with id' + battleId * ' not found')
				res.status(404).end();
				return;
			}
			Logger.log('debug', 'Returning ' + frames.length + ' frames');

			res.json(frames);
		});

}
module.exports = Chunk;
