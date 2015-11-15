var _, BattleQueue, Agent, Logger;

_ = require('underscore');
BattleQueue = require('../../model/BattleQueue');
Agent = require('../../model/Agent');
Logger = require('../../logger.js');


function QueueRequest(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	if (_.isUndefined(user)) {
		res.status(401).end();
		return;
	}
	var agents = req.body.agents;

	if (agents.length < 2) {
		res.status(400).end();
		return;
	}

	var units = req.body.units;

	if (units < 1 || units > 10) {
		units = 5;
	}


	Logger.log('debug', 'Searching agents to ensure that battle requuest is correct', agents);
	Agent.find({
		'_id': {
			$in: agents
		}
	}, function (err, foundAgents) {
		if (err || foundAgents.length < agents.length) {
			Logger.log('error', 'Agents not found');
			res.status(500);
			return;
		}

		Logger.log('debug', 'Agents found. Creating a battle.');
		var battleQueueEntity = new BattleQueue();
		battleQueueEntity.agents = foundAgents;
		battleQueueEntity.status = "PENDING";
		battleQueueEntity.requester = user._id;
		battleQueueEntity.unis = units;

		battleQueueEntity.save(function (err, response) {
			if (err) {
				Logger.log('error', 'Battle can\'t be created', err);
				res.status(500).json(err).end();
				return;
			}
			Logger.log('info', 'Battle created successfully', battleQueueEntity.agents);
			res.status(201).end();
		})
	});


}
module.exports = QueueRequest;
