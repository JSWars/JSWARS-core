var _, Q, Agent, User, Battle;

Q = require('q');
_ = require('underscore');
Agent = require('../../model/Agent');
Battle = require('../../model/Battle');
User = require('../../model/User');

function AgentListRoute(req, res) {


	var page = req.query.page || 1;

	if (page < 0) {
		res.status(400).end();
		return;
	}

	User.findOne({
		'username': req.params.username
	})
		.exec(function (err, user) {
			if (err) {
				res.status(500).end();
				return;
			}

			if (user == null) {
				res.status(404).end();
				return;
			}

			Agent.paginate({user: user._id}, {
				sort: '-moment',
				lean: true,
				page: page
			})
				.then(function (paginated) {
					if (err) {
						res.status(500).end();
						return;
					}

					var promises = [];
					for (var docIndex in paginated.docs) {
						(function (_docIndex) {
							promises.push(Battle.count({winner: paginated.docs[_docIndex]._id})
								.then(function (count) {
									paginated.docs[_docIndex].wins = count;
								}));

							promises.push(Battle.count({loosers: paginated.docs[_docIndex]._id})
								.then(function (count) {
									paginated.docs[_docIndex].losses = count;
								}));
						})(docIndex)
					}

					Q.allSettled(promises).then(function () {
						res.status(200).json(paginated);
					});

				}, function () {
					res.status(500).end();
				});
		}, function () {
			res.status(500).end();
		});
}
module.exports = AgentListRoute;
