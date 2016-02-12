var ModelName, _, Mongoose, Map;

ModelName = 'Map';
_ = require('underscore');
Mongoose = require('mongoose');

Map = new Mongoose.Schema({
	default: {type: Boolean, required: true, default: false},
	name: {type: String, required: true},
	data: {type: Object, required: true}
});

module.exports = Mongoose.model(ModelName, Map);


