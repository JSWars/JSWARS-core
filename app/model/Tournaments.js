var ModelName, _, Mongoose, mongoosePaginate, Battle;

ModelName = 'Tournament';
_ = require('underscore');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');

Tournament = new Mongoose.Schema({
	map: {type: Mongoose.Schema.Types.ObjectId, ref: 'Map', required: true},
	max: {type: Number, required: true},
	fps: {type: Number, required: true},
	start: {type: Date, required: true}
});
////agents: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true}],
Tournament.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, Tournament);


