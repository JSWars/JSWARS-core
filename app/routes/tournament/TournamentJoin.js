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

	var tournament = req.body.id;

	if (_.isUndefined(tournament)) {
		res.status(400).end();
		return;
	}

	var getMax = function (rounds) {
		var max = 0;

		for (var i = 1; i <= rounds; i++) {
			max += i * 2;
		}
		return max
	};

	var promises = [];

	promises.push(Agent.findById(agent)
		.lean(true)
		.exec());


	promises.push(Tournament.findById(tournament)
		.lean(true)
		.exec());

	promises.push(TournamentRegistration.find({tournament: tournament})
		.populate('agent')
		.lean(true)
		.exec());


	Q.allSettled(promises).spread(function (_agent, _tournament, _tournamentRegistrations) {
		if (_.isNull(_agent.value)) {
			res.status(400).json({errorId: "AGENT_NOT_FOUND"}).end();
			return;
		}
		if (_agent.value.user != user._id) {
			res.status(403).json({errorId: "UNAUTHORIZED"}).end();
			return;
		}
		if (_.isNull(_tournament.value)) {
			res.status(404).json({errorId: "TOURNAMENT_NOT_FOUND"}).end();
			return;
		}

		if (_tournamentRegistrations.value.length >= getMax(_tournament.value.rounds)) {
			res.status(400).json({errorId: "TOURNAMENT_FULL"});
		}

		if (_.find(_tournamentRegistrations.value, function (regis) {
				return regis.agent.user == user._id;
			})) {
			res.status(404).json({errorId: "ALREADY_JOINED"}).end();
			return;
		}

		var registration = new TournamentRegistration();
		registration.tournament = _tournament.value._id;
		registration.agent = _agent.value._id;
		registration.moment = new Date();
		registration.save(function (err, arg) {
			if (err) {
				Logger.log('error', err);
				res.status(500).end();
				return;
			}
			res.status(204).end();
		})
	});

}

module.exports = Join;
