var _, mongoose, Q, Tournament, TournamentRegistration, Agent, Map, User;

_ = require('underscore');
mongoose = require('mongoose');
Q = require("q");
Tournament = require('../../model/Tournament');
TournamentRegistration = require('../../model/TournamentRegistration');

function List(req, res) {

	var user = req.session.internalUser;

	var page = req.query.page || 1;

	if (page < 0) {
		res.status(400).end();
		return;
	}

	var promises = [];

	var options = {
		lean: true,
		page: page,
		sort: {moment: -1},
	};

	Tournament.paginate({}, options)
		.then(function (paginated) {
			for (var docIndex in paginated.docs) {
				(function (_docIndex) {
					promises.push(TournamentRegistration.find({tournament: paginated.docs[_docIndex]})
							.populate('agent')
							.then(function (results) {
								var count = results.length;
								paginated.docs[_docIndex].registrations = count;
								paginated.docs[_docIndex].max = Math.pow(2, (paginated.docs[_docIndex].rounds));
								paginated.docs[_docIndex].joined = false;
								//paginated.docs[_docIndex].joined = user !== undefined && _.find(results, function (regis) {
								//		return regis.agent.user == user._id
								//	}) != undefined
							})
					)
				})
				(docIndex);
			}

			Q.allSettled(promises).then(function () {
				res.json(paginated);
			});

		}
	);
}

module.exports = List;
