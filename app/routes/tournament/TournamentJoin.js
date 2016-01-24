var Q, _, BattleQueue, Agent, TournamentRegistration, Tournament, Logger;

Q = require('q');
_ = require('underscore');
Agent = require('../../model/Agent');
Tournament = require('../../model/Tournament');
TournamentRegistration = require('../../model/TournamentRegistration');
Logger = require('../../logger.js');


function Join(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	if (_.isUndefined(user)) {
		res.status(401).end();
		return;
	}

	var agent = req.body.agent;

	if (_.isUndefined(agent)) {
		res.status(400).end();
		return;
	}

	var tournament = req.body.tournament;

	if (_.isUndefined(tournament)) {
		res.status(400).end();
		return;
	}

	var promises = [];

	promises.push(Agent.findById(agent)
		.populate('user')
		.lean(true)
		.exec());


	promises.push(Tournament.findById(tournament)
		.lean(true)
		.exec());

	promises.push(TournamentRegistration.find({tournament: tournament})
		.populate('agent', ['user'])
		.lean(true)
		.exec());


	Q.allSettled(promises).spread(function (_agent, _tournament, _tournamentRegistrations) {
		if (_.isNull(_agent)) {
			res.status(400).json({errorId: "AGENT_NOT_FOUND"}).end();
			return;
		}
		if (_agent.user.username != user.username) {
			res.status(403).json({errorId: "UNAUTHORIZED"}).end();
			return;
		}
		if (_.isNull(_tournament)) {
			res.status(404).json({errorId: "TOURNMANET_NOT_FOUND"}).end();
			return;
		}

		console.log(_tournamentRegistrations);

	});

}

module.exports = Join;
