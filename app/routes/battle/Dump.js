var Q, Battle, BattleFrame, Mongoose, Logger;

Q = require('q');
Battle = require('../../model/Battle');
BattleFrame = require('../../model/BattleFrame');
Mongoose = require('mongoose');
Logger = require('../../logger.js');

function Dump(req, res) {
	var  battleId;

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

			res.set('Content-Description','jswars_' + battleId + '.json');
			res.set('Content-Type','application/json');
			res.set('Content-Disposition','attachment; filename=jswars_' + battleId + '.json');
			res.set('Pragma','no-cache');

			res.send(JSON.stringify(response)).end();
		}, function (errors) {
			res.status(500).json(errors).end();
		});


}
module.exports = Dump;
