var User;

User = require('../model/User');


/**
 * Route to obtain current session information
 *
 * @param {Object} Request
 * @param {Object} Response
 * @constructor
 */
function Session(req, res) {
    var githubData = req.user._json;
    User.findOne({
            githubId: githubData.id
        }
    )
        .exec()
        .then(function (err, user) {
            if (err) {
                //Something going wrong during database call :(
                res.status(500).end();
            }
            if (user === null) {
                //User is not registered
                User.create()
                    .then(function () {

                    });
            }

            res.json(user);

        }, function () {
            
        });

}

module.exports = Session;