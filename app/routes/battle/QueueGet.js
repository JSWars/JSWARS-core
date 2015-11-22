var _, BattleQueue, Agent, Logger;

_ = require('underscore');
BattleQueue = require('../../model/BattleQueue');
Logger = require('../../logger.js');


function QueueItem(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	if (_.isUndefined(user)) {
		res.status(401).end();
		return;

	}

	var id = req.params.id;


	if (id === undefined) {
		res.status(404).end();
		return;
	}

	BattleQueue.findById(id)
		.lean()
		.exec(function (err, queueItem) {
		if (err) {
			Logger.log('error', 'Can\'t find queue item');
			res.status(500).end();
			return;
		}
			Logger.log('debug', 'Queue item found');
		res.status(200).json(queueItem).end();
	});



}
module.exports = QueueItem;
