var _, Agent, User;

_ = require('underscore');
Agent = require('../../model/Agent');
User = require('../../model/User');

function AgentListRoute(req, res) {

	var username = req.params.username;

	//if (username === undefined || username.trim().length === 0) {
	//	res.status(400).end();
	//}

	var query = {
		'username': req.params.username
	};
	User.findOne(query)
		.exec(function (err, user) {
			if (err) {
				res.status(500).end();
				return;
			}

			if (user == null) {
				res.status(404).end();
				return;
			}

			Agent.find({user: user._id})
				.sort('-moment')
				//.populate('versions')
				.exec(function (err, agents) {
					if (err) {
						res.status(500).end();
						return;
					}

					var formatted = [];
					_.map(agents, function (agent) {
						formatted.push(
							_.extend(
								agent.toJSON(),
								{
									wins: 0,
									losses: 0,
									rank: 0
								}
							)
						);
					});

					res.status(200).json(formatted);
				}, function () {
					res.status(500).end();
				});
		}, function () {
			res.status(500).end();
		});
}
module.exports = AgentListRoute;
