var Config;

Config = require('../../../config');

function EntryRoute(req, res) {
    req.session.return = req.query.return;
    res.redirect(Config.path + '/login/github/callback');
}
module.exports = EntryRoute;