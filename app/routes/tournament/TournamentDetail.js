var _, mongoose, Q, Tournament, TournamentRegistration;

_ = require('underscore');
mongoose = require('mongoose');
Q = require("q");

Tournament = require('../../model/Tournament');
TournamentRegistration = require('../../model/TournamentRegistration');

function TournamentDetail(req, res) {

	var user = req.session.internalUser;

	var tournament = req.params.id;

	var ret = {};

	var promises = [];

	promises.push(Tournament.findById(tournament)
		.lean(true)
		.then(function (found) {
			ret = _.extend(ret, found);
		}
	));

	promises.push(TournamentRegistration.find({tournament: tournament})
		.populate('agent')
		.then(function (inscriptions) {
			ret.inscriptions = inscriptions;

		}));

	Q.allSettled(promises).then(function () {
		ret.max = Math.pow(2, (ret.rounds));
		ret.joined = user !== undefined && _.find(ret.inscriptions, function (regis) {
				return regis.agent.user == user._id
			}) != undefined;
		res.status(200).json(ret).end();
	})

}

module.exports = TournamentDetail;
