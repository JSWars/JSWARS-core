var _, mongoose, Q, User, Battle, Tournament, TournamentRegistration;

_ = require('underscore');
mongoose = require('mongoose');
Q = require("q");

User = require('../../model/User');
Battle = require('../../model/Battle');
Tournament = require('../../model/Tournament');
TournamentRegistration = require('../../model/TournamentRegistration');

function TournamentDetail(req, res) {

	var user = req.session.internalUser;

	var tournament = req.params.id;


	var result = {};

	var promises = [];

	promises.push(Tournament.findById(tournament)
		.lean(true)
		.then(function (found) {
			result = _.extend(result, found);
		}
	));

	promises.push(TournamentRegistration.find({tournament: tournament})
		.populate('agent')
		.select('-tournament -__v ')
		.then(function (inscriptions) {
			result.inscriptions = inscriptions;
		}));

	promises.push(Battle.find({tournament: tournament})
		.populate('winner agents loosers')
		.select('-tournament -__v')
		.sort('tournamentRound')
		.then(function (battles) {
			result.battles = battles;
		}));

	Q.allSettled(promises).then(function () {
		result.max = Math.pow(2, (result.rounds));
		result.joined = false;
		//ret.joined = user !== undefined && _.find(ret.inscriptions, function (regis) {
		//		return regis.agent.user == user._id
		//	}) != undefined;

		var userPromises = [];

		if (result.battles.length > 0) {
			userPromises.push(User.populate(result.battles, {
				path: 'agents.user winner.user loosers.user',
				select: '_id username name country'
			}));
		}


		if (result.inscriptions.length > 0) {
			userPromises.push(User.populate(result.inscriptions, {
				path: 'agent.user',
				select: '_id username name country'
			}));
		}

		Q.allSettled(userPromises).then(function () {
			res.status(200).json(result).end();
		});

	})

}

module.exports = TournamentDetail;
