"use strict";
var ModelName, _, Mongoose, PasswordHashing, User;

ModelName = 'User';
_ = require('underscore');
Mongoose = require('mongoose');
PasswordHashing = require('./../utils/PasswordHashing');

User = new Mongoose.Schema({
    username: String,
    password: String,
    email: String,
    ghId: String,
    created: Date
});

User.methods.validPassword = function (password) {
    console.log(this);
    return false;
};

User.statics.signup = function (user, done) {
    this.model(ModelName).findOne({'username': user.username},
        function (err, user) {
            if (!_.isNull(user)) {
                done(true);
            } else {
                var PasswordObject = new PasswordHashing(user.password);
                user.password = PasswordObject.hash();
                user.save();
                done(false,user);
            }
        });
};


if (_.indexOf(Mongoose.modelNames(), ModelName) !== -1 ) {
    module.exports = Mongoose.model(ModelName);
} else {
    module.exports = Mongoose.model(ModelName, User);
}


