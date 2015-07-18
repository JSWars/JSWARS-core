var ModelName, _, Mongoose, BattleFrame;

ModelName = 'BattleFrame';
_ = require('underscore');
Mongoose = require('mongoose');

BattleFrame = new Mongoose.Schema({
	id: {type: Number, index: true},
	battle: {type: Mongoose.Schema.Types.ObjectId, ref: 'Battle', required: true},
	index: {type: Number, required: true},
	data: {type: Object, required: true}
});

module.exports = Mongoose.model(ModelName, BattleFrame);


