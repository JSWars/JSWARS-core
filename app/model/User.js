var ModelName, Mongoose, User;

ModelName = 'User';
Mongoose = require('mongoose');

User = new Mongoose.Schema({
    username: {type: String, index: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: false},
    created: {type: Date, required: true},
    avatar: {type: String, required: false},
    country: {type: String, required: false},
    github: {type: Object, required: true}
});

module.exports = Mongoose.model(ModelName, User);


