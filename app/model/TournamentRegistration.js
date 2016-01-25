var ModelName, _, Mongoose, mongoosePaginate, Battle;

ModelName = 'TournamentRegistration';
_ = require('underscore');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');

TournamentRegistration = new Mongoose.Schema({
	tournament: {type: Mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true},
	agent: {type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true},
	moment: {type: Date, required: true}
});

TournamentRegistration.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, TournamentRegistration);


