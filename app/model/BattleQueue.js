var ModelName, _, Mongoose, BattleQueue;

ModelName = 'BattleQueue';
_ = require('underscore');
Mongoose = require('mongoose');

BattleQueue = new Mongoose.Schema({
	id: {type: Number, index: true},
	agents:[String],
	status: {type: String, enum: ['PENDING', 'RUNNING', 'ENDED']},
	requester: {type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	moment: {type: Date, required: true, default: new Date()}
});

module.exports = Mongoose.model(ModelName, BattleQueue);


