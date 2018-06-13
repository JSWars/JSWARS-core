var Config = require('./config.js');
var Mongoose = require('mongoose');
var Battle = require('./model/Battle');
var BattleResult = require('./model/BattleResult');


//Connect to Mongo
Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (error) {
	Logger.log('error', 'Error connecting to database', error)
});

BattleResult.find().exec(function (err, battleResults) {

	for (var idx in battleResults) {
		(function (_idx) {
			console.log( battleResults[_idx].id)
			console.log(battleResults[_idx].get("winner"))
			Battle.update({_id: battleResults[_idx].id}, {
				winner: battleResults[_idx].get("winner"),
				loosers: battleResults[_idx].get("loosers")
			}, {}, function (err,response) {
				console.log(response);
			});
		})(idx);
	}
});
/**
 * Created by marcx on 08/02/2016.
 */
