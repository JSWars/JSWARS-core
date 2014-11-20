"use strict";
var User, Passport, Validator, SignupRoute;

Validator = require('validator');
Passport = require('passport');
User = require('../model/User');


SignupRoute = function (req, res) {
    var user;

    if (!Validator.isEmail(req.body.email)) {
        res.error("Email is not valid");
    }

    if (!Validator.isLength(req.body.username, 6, 20)) {
        res.error("Username must have 6-20 characters");
    }

    if (!Validator.isLength(req.body.passwod, 6, 20)) {
        res.error("Password must have 6-20 characters");
    }

    user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.created = new Date();

    User.signup(user, function (err, user) {
            if (err) {
                res.error("User already exist");
                return;
            }

            Passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });

        }
    )
    ;
};

module.exports = SignupRoute;