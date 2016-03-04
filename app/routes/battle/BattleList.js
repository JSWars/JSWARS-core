var _, mongoose, Q, Battle, User, Map;

_ = require('underscore');
mongoose = require('mongoose');
Q = require("q");
Battle = require('../../model/Battle');
User = require('../../model/User');

function List(req, res) {

	var page = req.query.page || 1;

	if (page < 0) {
		res.status(400).end();
		return;
	}

	var username = req.query.username;

	var options = {
		sort: "-moment",
		lean: false,
		page: page,
		populate: 'agents',
	};

	Battle.paginate({
		status: {$ne: 'ERROR'}
	}, options)
		.then(function (paginated) {
			User.populate(paginated.docs, {
				path: 'agents.user',
				select: 'username _id'
			}).then(function () {
					res.status(200).json(paginated).end();
				}
			);


		});
}

module.exports = List;
