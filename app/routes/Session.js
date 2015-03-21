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

    var user = req.session.internalUser;

    if (user) {
        res.json(user);
    } else {
        res.status(403).end();
    }
}

module.exports = Session;