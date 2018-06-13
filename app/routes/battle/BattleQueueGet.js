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
		.populate('battle')
		.lean()
		.exec(function (err, queueItem) {
			if (err) {
				Logger.log('error', 'Can\'t find queue item');
				res.status(500).json({errorID: "ITEM_QUEUE_NOT_FOUND"}).end();
				return;
			}
			function listenPostal() {
				Logger.log('info', 'Queue item pending or running');
				postal.subscribe({
					channel: "queue",
					topic: "battle.ended." + id,
					callback: function (data) {
						QueueItem(req, res);
					}
				});
				postal.subscribe({
					channel: "queue",
					topic: "battle.error." + id,
					callback: function (data) {
						res.status(500).json({errorId: data}).end();
					}
				});
			}

			if (queueItem.battle == undefined || queueItem.battle == null) {
				listenPostal();
			} else {

				switch (queueItem.battle.status) {
					case 'PENDING':
					case 'RUNNING':
						listenPostal();
						break;
					case 'ENDED':
						queueItem.battle = queueItem.battle._id;
						res.status(200).json(queueItem).end();
						break;
					case 'ERROR':
						queueItem.battle = queueItem.battle._id;
						res.status(500).json({errorId: 'UNKNOWN'}).end();
						break;
				}
			}
		});


}
module.exports = QueueItem;
