var _, Q, Battle, BattleFrame, Map, Agent, Crypto;

_ = require('underscore');
Q = require('q');
Battle = require('../../model/Battle');
BattleFrame = require('../../model/BattleFrame');
Map = require('../../model/Map');
Agent = require('../../model/Agent');
Crypto = require('crypto');

function BattleDetail(req, res) {
	var id = req.params.id;


	Battle.findById(id)
		.select('-__v')
		.populate('map')
		.exec(function (err, _battle) {
			if (err) {
				res.status(500).json(err).end();
				return;
			}

			if (_battle == null) {
				res.status(404).end();
				return;
			}

			var response = _battle.toObject();


			var agentsPromise = Agent.find({
				'_id': {
					$in: _battle.agents
				}
			})
				.select('-__v')
				.populate('user')
				.exec(function (err, agents) {
					if (err) {
						res.status(500).json(err).end();
						return;
					}

					var teams = {};

					for (var i in agents) {
						var agent = agents[i];
						teams[i] = {
							agent: agent.id,
							name: agent.name,
							color: agent.color || '#ffffff',
							user: {
								_id: agent.user._id,
								username: agent.user.username,
								//TODO: Ñapa
								avatar: ((agent.user.github.avatar_url) ? agent.user.github.avatar_url : ((agent.user.github.email) ? "http://www.gravatar.com/avatar/" + Crypto.createHash('md5').update(agent.user.github.email).digest('hex') : undefined)),
								country: agent.user.country
							}
						};
					}
					response = _.extend({
						teams: teams
					}, response);
				});

			var countPromise = BattleFrame.count({
				"battle": id
			}).exec(function (err, count) {
				if (err) {
					res.status(500).json(err).end();
					return;
				}

				response = _.extend({
					frameCount: count
				}, response);
			});

			Q.allSettled([agentsPromise, countPromise])
				.then(function () {
					res.json(response);
				});


		});


}
module.exports = BattleDetail;
