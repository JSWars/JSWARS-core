var ModelName, _, postal, Mongoose, BattleAgentLog;

ModelName = 'BattleAgentLog';
_ = require('underscore');
Mongoose = require('mongoose');


BattleAgentLog = new Mongoose.Schema({
	id: {type: Number, index: true},
	agent: {type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true},
	battle: {type: Mongoose.Schema.Types.ObjectId, ref: 'Battle', required: true},
	log: {type: String, required: true}
});

module.exports = Mongoose.model(ModelName, BattleAgentLog);


