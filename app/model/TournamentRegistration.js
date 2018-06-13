var ModelName, postal, Mongoose, mongoosePaginate, Battle;

ModelName = 'TournamentRegistration';
postal = require('postal');
Mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate');

TournamentRegistration = new Mongoose.Schema({
	tournament: {type: Mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true},
	agent: {type: Mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true},
	moment: {type: Date, required: true}
});

TournamentRegistration.post('save', function (model) {
	postal.publish({
		channel: "models",
		topic: "tournament.join",
		data: model
	});
});

TournamentRegistration.plugin(mongoosePaginate);

module.exports = Mongoose.model(ModelName, TournamentRegistration);


