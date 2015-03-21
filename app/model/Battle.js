var ModelName, _, Mongoose, Battle;

ModelName = 'Battle';
_ = require('underscore');
Mongoose = require('mongoose');

Battle = new Mongoose.Schema({
    id: {type: Number, index: true},
    agents: [
        {type: Mongoose.Schema.Types.ObjectId, ref: 'AgentVersion'}
    ],
    moment: {type: Date, required: true, default: new Date()},
    duration: {type: Number, required: false}
});

module.exports = Mongoose.model(ModelName, Battle);


