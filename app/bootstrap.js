"use strict";

var Mongoose, _, PasswordHashing, Config, User;

Mongoose = require('mongoose');
_ = require('underscore');

//App Modules
PasswordHashing = require('./utils/PasswordHashing');
Config = require('./config');
User = require('./model/user');

Mongoose.connect(Config.db.url);
Mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: %s', err);
});

User.findOne({
		'username': 'patos'
	},
	function found(err, user) {
		if (_.isNull(user)) {
			var admin = new User();
			admin.username = "patos";
			admin.password = new PasswordHashing("patofilia").hash();
			admin.email = "djwedo@gmail.com";
			admin.created = new Date();
			admin.save();
		} else {
			console.log("Admin user already registered");
		}

		Mongoose.disconnect();
	}
);
