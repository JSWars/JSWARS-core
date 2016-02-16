var User, Crypto;

User = require('../../model/User');
Crypto = require('crypto');


function UserRoute(req, res) {

	User.findOne({
			username: req.params.username
		}
	).exec(function (err, user) {
			if (err) {
				res.status(500).end();
				return;
			}
			if (user) {
				var jsonuser = user.toJSON();
				if (jsonuser.github.avatar_url) {
					jsonuser.avatar = jsonuser.github.avatar_url;
				} else if (jsonuser.github.email) {
					jsonuser.avatar = "http://www.gravatar.com/avatar/" + Crypto.createHash('md5').update(jsonuser.github.email).digest('hex');
				}
				res.json(jsonuser);
			} else {
				res.status(404).end();
			}
		});
}

module.exports = UserRoute;
