var ModelName, _, Mongoose, Agent;

ModelName = 'Agent';
_ = require('underscore');
Mongoose = require('mongoose');

Agent = new Mongoose.Schema({
    id: {type: Number, index: true},
    name: String,
    versions: [
        {type: Mongoose.Schema.Types.ObjectId, ref: 'AgentVersion'}
    ]
});

module.exports = Agent;


