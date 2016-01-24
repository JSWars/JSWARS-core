var ModelName, _, Mongoose, mongoosePaginate, Battle;

ModelName = 'BattleResult';
_ = require('underscore');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');

BattleResult = new Mongoose.Schema({
	battle: {type: Mongoose.Schema.Types.ObjectId, ref: 'Battle', required: true},
	moment: {type: Date, required: true},
	winner: {type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true},
	loosers: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true}]
});

BattleResult.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, BattleResult);


