var ModelName, _, Mongoose, mongoosePaginate, Battle;

ModelName = 'Battle';
_ = require('underscore');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');

Battle = new Mongoose.Schema({
	map: {type: Mongoose.Schema.Types.ObjectId, ref: 'Map', required: true},
	chunkSize: {type: Number, required: true},
	fps: {type: Number, required: true},
	agents: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true}],
	status: {type: String, enum: ['PENDING', 'RUNNING', 'ENDED', 'ERROR'], default: 'PENDING'},
	moment: {type: Date, required: true},
	duration: {type: Number, required: false},
	tournament: {type: Mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: false},
	tournamentRound: {type: Number, required: false},
	winner: {type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: false},
	loosers: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: false}]
});

Battle.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, Battle);


