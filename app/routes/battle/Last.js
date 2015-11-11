var _, Q, Battle, User, Agent;

_ = require('underscore');
Q = require('q');
Battle = require('../../model/Battle');
Agent = require('../../model/Agent');

function List(req, res) {
	Battle.find({})
		.select('-__v')
		.sort('-moment')
		.limit(20)
		.lean(true)
		.exec(function (err, battles) {



			res.json(battles);
		}, function () {
			res.status(500).end();
		});
}
module.exports = List;
