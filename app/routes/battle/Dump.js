var Q,Battle, BattleFrame, Mongoose, Logger;

Q = require('q');
Battle = require('../../model/Battle');
BattleFrame = require('../../model/BattleFrame');
Mongoose = require('mongoose');
Logger = require('../../logger.js');

function Chunk(req, res) {
	var chunkId, battleId, chunkSize, chunkStartFrame, chunkEndFrame;

	battleId = req.params.id;

	Logger.log('debug', 'Requested dump for battle ' + battleId);

	var promises = [];
	promises.push(Battle.findById(battleId)
		.populate('map'));


	promises.push(BattleFrame.find({
		battle: battleId
	})
		.sort({'index': 1})
		.select({data: 1}));

	Q.all(promises)
		.then(function (results) {
			var response = {
				battle: results[0],
				frames: results[1]
			};

			res.json(response).end();
		}, function (errors) {
			res.status(500).json(errors);
		});



}
module.exports = Chunk;
