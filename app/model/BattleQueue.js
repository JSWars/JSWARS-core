var ModelName, _, postal, Mongoose, BattleQueue;

ModelName = 'BattleQueue';
_ = require('underscore');
postal = require('postal');
Mongoose = require('mongoose');


BattleQueue = new Mongoose.Schema({
	agents: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true}],
	requester: {type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	units: {type: Number, required: true, default: 4},
	moment: {type: Date, required: true},
	battle: {type: Mongoose.Schema.Types.ObjectId, ref: 'Battle'}
});


BattleQueue.post('save', function (model) {
	postal.publish({
		channel: "models",
		topic: "battle.save",
		data: model
	});
});


module.exports = Mongoose.model(ModelName, BattleQueue);


