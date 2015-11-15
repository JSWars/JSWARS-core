var _, Q, Battle, User, Agent;

_ = require('underscore');
Q = require('q');
Battle = require('../../model/Battle');
Agent = require('../../model/Agent');

function List(req, res) {
	Battle.find({})
		.select('-__v')
		.sort('-moment')
		.populate('agents')
		.limit(20)
		.lean(true)
		.exec(function (err, battles) {
			if (err) {
				res.status(500).end();
				return;
			}

			//var promises = [];
			//
			//for (var battleId in battles) {
			//	var battle = battles[battleId];
			//	for (var agentId in battle.agents) {
			//		var agent = battle.agents[agentId];
			//		promises.push(Agent.populate(agent.user, {
			//			path: 'user',
			//			model: 'User'
			//		}));
			//	}
			//}
			//
			//Q.all(promises)
			//	.then(function () {
			//		res.json(battles);
			//	})

			res.json(battles);
		}, function () {
			res.status(500).end();
		});
}
module.exports = List;
