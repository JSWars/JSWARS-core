var  Battle, BattleFrame;

Battle = require('../../model/Battle');

function Map(req, res) {
	var id=req.params.id;

	Battle.findById(id).exec(function (err, battle) {
		if (err ) {
			res.status(500).json({error: 'ERROR_RECOVERING_BATTLE'}).end();
			return;
		}
		res.json(battle);
	});



}
module.exports = Map;
