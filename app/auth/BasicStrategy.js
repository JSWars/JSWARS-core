/**
 * Created by marcx on 17/11/2014.
 */
"use strict";

var User, LocalStrategy, StrategyImpl;

User = require("./../model/User");
LocalStrategy = require('passport-local').Strategy;

StrategyImpl = new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done) {
        // Check user exist in database
        User.findOne({'username': username},
            function (err, user) {
                // If error, return result
                if (err) {
                    return done(err);
                }
                // Username does not exist, log error & redirect back
                if (!user) {
                    console.log('User Not Found with username ' + username);
                    return done(null, false,
                        'User Not found.');
                }
                // User exists but wrong password, log the error
                if (!User.validPassword(password)) {
                    console.log('Invalid Password');
                    return done(null, false,
                        req.flash('message', 'Invalid Password'));
                }
                // User and password both match, return user from
                // done method which will be treated like success
                return done(null, user);
            }
        );
    }
);

module.exports = StrategyImpl;