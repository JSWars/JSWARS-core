var ModelName, _, Mongoose, mongoosePaginate, Battle;

ModelName = 'TournamentInscription';
_ = require('underscore');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');
//agents: [],
TournamentInscription = new Mongoose.Schema({
	tournament: {type: Mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true},
	agent: {type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true},
	moment: {type: Date, required: true}
});

TournamentInscription.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, TournamentInscription);


