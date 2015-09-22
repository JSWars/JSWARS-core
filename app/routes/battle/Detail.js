var Battle, Map;

Battle = require('../../model/Battle');
Map = require('../../model/Map');

function BattleDetail(req, res) {
	var id = req.params.id;

	Battle.findById(id)
		.select('-__v')
		.populate('map')
		.exec(function (err, battle) {
			if (err) {
				res.status(500).json(err).end();
				return;
			}
			res.json(battle);
		});


}
module.exports = BattleDetail;
