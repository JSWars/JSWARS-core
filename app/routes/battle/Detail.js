var _, Battle, Map, Agent;

_ = require('underscore');
Battle = require('../../model/Battle');
Map = require('../../model/Map');
Agent = require('../../model/Agent');

function BattleDetail(req, res) {
	var id = req.params.id;

	Battle.findById(id)
		.select('-__v')
		.populate('map')
		.exec(function (err, battle) {
			if (err) {
				res.status(500).json(err).end();
				return;
			}

			Agent.find({
				'_id': {
					$in: battle.agents
				}
			})
				.select('-__v')
				.populate('user')
				.exec(function (err, agents) {
					if (err) {
						res.status(500).json(err).end();
					}

					var teams = {};

					for (var i in agents) {
						var agent = agents[i];
						teams[i] = {
							name: agent.name,
							color: '#ffffff',
							user: {
								id: agent.user._id,
								username: agent.user.username,
								avatar: agent.user.avatar,
								country: agent.user.country
							}
						};
					}


					var response = _.extend({
						teams: teams
					}, battle.toObject());

					console.log('teams', JSON.stringify(response))


					res.json(response);
				});


		});


}
module.exports = BattleDetail;
