var ModelName, _, Mongoose, Agent, mongoosePaginate;

ModelName = 'Agent';
_ = require('underscore');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');

Agent = new Mongoose.Schema({
	name: {type: String, required: true},
	user: {type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	moment: {type: Date, required: true},
	color: {type: String, required: false}
});

Agent.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, Agent);

