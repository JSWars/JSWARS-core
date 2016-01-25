var _, BattleQueue, Agent, Logger, postal;

_ = require('underscore');
BattleQueue = require('../../model/BattleQueue');
Logger = require('../../logger.js');
postal = require('postal');


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
			switch (queueItem.status) {
				case 'PENDING':
				case 'RUNNING':
					Logger.log('info', 'Queue item pending or running');
					postal.subscribe({
						channel: "queue",
						topic: "battle.ended." + id,
						callback: function (model) {
							QueueItem(req, res);
						}
					});
					break;
				case 'ENDED':
					Logger.log('info', 'Queue item ended');
					res.status(200).json(queueItem).end();
					break;
				case 'ERROR':
					Logger.log('info', 'Queue item error');
					res.status(500).json(queueItem).end();
					break;
			}
		});


}
module.exports = QueueItem;
