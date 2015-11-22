var ModelName, _, postal, Mongoose, BattleQueue;

ModelName = 'BattleAgentLog';
_ = require('underscore');
postal = require('postal');
Mongoose = require('mongoose');


BattleQueue = new Mongoose.Schema({
	id: {type: Number, index: true},
	agents: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true}],
	status: {type: String, enum: ['PENDING', 'RUNNING', 'ENDED']},
	requester: {type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	units: {type: Number, required: true, default: 5},
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


