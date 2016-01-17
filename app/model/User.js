var ModelName, Mongoose,mongoosePaginate, User;

ModelName = 'User';
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');


User = new Mongoose.Schema({
	username: {type: String, index: true, unique: true},
	name: {type: String, required: false},
	email: {type: String, required: false},
	created: {type: Date, required: true},
	avatar: {type: String, required: false},
	country: {type: String, required: false},
	github: {type: Object, required: true}
});

User.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, User);


