var _, Battle, User;

_ = require('underscore');
Battle = require('../../model/Battle');

function BattleList(req, res) {
	Battle.find({})
		.select('-__v')
		.sort('-moment')
		.lean(true)
		.exec(function (err, battles) {
			res.json(battles);
		}, function () {
			res.status(500).end();
		});
}
module.exports = BattleList;
