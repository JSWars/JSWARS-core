var _, BattleQueue;

_ = require('underscore');
BattleQueue = require('../../model/BattleQueue');

function QueueRequest(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	//console.log(req.session);
	//if (_.isUndefined(user) || user.username !== req.params.username) {
	//	res.status(401).end();
	//	return;
	//}

	var agents = req.body.agents;

	var newBattleQueue = new BattleQueue();
	newBattleQueue.agents = agents;
	newBattleQueue.status = "PENDING";
	newBattleQueue.requester = user;

	newBattleQueue.save(function (err, response) {
		if (err) {
			res.status(500).json(err).end();
			return;
		}
		res.status(201).end();
	})


}
module.exports = QueueRequest;
