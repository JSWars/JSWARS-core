var Q, Battle, Agent, BattleFrame, Mongoose, Logger;

Q = require('q');
Battle = require('../../model/Battle');
BattleFrame = require('../../model/BattleFrame');
Agent = require('../../model/Agent');
Mongoose = require('mongoose');
Logger = require('../../logger.js');

function Dump(req, res) {
	var battleId;

	battleId = req.params.id;

	Logger.log('debug', 'Requested dump for battle ' + battleId);

	var promises = [];
	promises.push(Battle.findById(battleId)
		.lean(true));


	promises.push(BattleFrame.find({
		battle: battleId
	})
		.sort({'index': 1})
		.lean(true)
		.select({data: 1}));

	Q.all(promises)
		.then(function (results) {
			var response = {
				battle: results[0],
				frames: results[1]
			};

			for (var i = 0; i < response.frames.length; i++) {
				response.frames[i] = response.frames[i].data;
			}

			Agent.find({
				'_id': {
					$in: response.battle.agents
				}
			})
				.populate('user')
				.lean(true)
				.exec(function (err, agents) {
					response.battle.agents = agents;
					res.set('Content-Description', 'jswars_' + battleId + '.json');
					res.set('Content-Type', 'application/json');
					res.set('Content-Disposition', 'attachment; filename=jswars_' + battleId + '.json');
					res.set('Pragma', 'no-cache');

					for(var o = 0; o< response.battle.agents.length; o++){
						response.battle.agents[o].username = response.battle.agents[o].user.username;
						delete response.battle.agents[o].user;
					}

					res.send(JSON.stringify(response)).end();

				});

		}, function (errors) {
			res.status(500).json(errors).end();
		});


}
module.exports = Dump;
