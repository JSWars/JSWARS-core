var ModelName, _, Mongoose, Agent;

ModelName = 'Agent';
_ = require('underscore');
Mongoose = require('mongoose');

Agent = new Mongoose.Schema({
    id: {type: Number, index: true},
    name: String,
    file: String,
    moment: Date
});

module.exports = Agent;


