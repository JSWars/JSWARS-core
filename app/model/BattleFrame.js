var ModelName, _, Mongoose, Agent;

ModelName = 'Agent';
_ = require('underscore');
Mongoose = require('mongoose');

Agent = new Mongoose.Schema({
    id: {type: Number, index: true},
    agents: [
        {type: Mongoose.Schema.Types.ObjectId, ref: 'AgentVersion'}
    ],
    moment: Date,
    duration: Number
});

module.exports = Agent;


