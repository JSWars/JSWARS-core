var ModelName, _, Mongoose, mongoosePaginate, Battle;

ModelName = 'Tournament';
_ = require('underscore');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');

Tournament = new Mongoose.Schema({
	name: {type: String, required: true},
	map: {type: Mongoose.Schema.Types.ObjectId, ref: 'Map', required: true},
	rounds: {type: Number, required: true},
	fps: {type: Number, required: true},
	moment: {type: Date, required: true},
	start: {type: Date, required: false}
});
Tournament.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, Tournament);


