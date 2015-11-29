var User;

User = require('../model/User');

function UserUpdateRoute(req, res) {

	var user = req.session.internalUser;

	if (user === undefined) {
		res.status(403).end();
		return;
	}

	if (user.username !== req.params.username) {
		res.status(400).end();
		return;
	}

	var query = {
		username: req.params.username
	};

	var update = {
		$set: {
			name: req.body.name,
			email: req.body.email,
			// avatar: req.body.avatar,
			country: req.body.country
		}
	};

	User.update(query, update, {})
		.exec(function (err) {
			if (err) {
				res.status(500).end();
				return;
			}
			//If no error, get object from user data from database and return it
			User.findOne(query).exec(function (err, user) {
				if (err) {
					res.status(500).end();
					return;
				}
				req.session.internalUser = user;
				res.status(200).end();
			});

		});
}

module.exports = UserUpdateRoute;
