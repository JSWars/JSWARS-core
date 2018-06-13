var ModelName, _, Mongoose, mongoosePaginate, AgentVersion;

ModelName = 'AgentVersion';
_ = require('underscore');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');


AgentVersion = new Mongoose.Schema({
	code: {type: String, required: true},
	moment: {type: Date, required: true},
	agent: {type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true}
});

AgentVersion.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, AgentVersion);
