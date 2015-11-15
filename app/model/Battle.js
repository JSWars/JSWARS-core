var ModelName, _, Mongoose, Battle;

ModelName = 'Battle';
_ = require('underscore');
Mongoose = require('mongoose');

Battle = new Mongoose.Schema({
	id: {type: Number, index: true},
	map: {type: Mongoose.Schema.Types.ObjectId, ref: 'Map', required: true},
	chunkSize: {type: Number, required: true},
	fps: {type: Number, required: true},
	agents: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true}],
	moment: {type: Date, required: true},
	duration: {type: Number, required: false}
});

module.exports = Mongoose.model(ModelName, Battle);


