var ModelName, _, Mongoose, AgentVersion;

ModelName = 'AgentVersion';
_ = require('underscore');
Mongoose = require('mongoose');

AgentVersion = new Mongoose.Schema({
	code: {type: String, required: true},
	moment: {type: Date, required: true},
	agent: {type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true}
});

module.exports = Mongoose.model(ModelName, AgentVersion);
