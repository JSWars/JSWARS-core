var _, mongoose, Q, Tournament, TournamentRegistration, Agent, Map, User;

_ = require('underscore');
mongoose = require('mongoose');
Q = require("q");
Tournament = require('../../model/Tournament');
TournamentRegistration = require('../../model/TournamentRegistration');

function List(req, res) {

	var page = req.query.page || 1;

	if (page < 0) {
		res.status(400).end();
		return;
	}

	var promises = [];

	var options = {
		lean: true,
		page: page,
		sort: {moment: -1}
	};

	Tournament.paginate({}, options)
		.then(function (paginated) {
			for (var docIndex in paginated.docs) {
				(function (_docIndex) {
					promises.push(TournamentRegistration.count({battle: paginated.docs[_docIndex]})
							.then(function (count) {
								paginated.docs[_docIndex].registrations = count;
								paginated.docs[_docIndex].max = Math.pow(paginated.docs[_docIndex].rounds, 2);
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
