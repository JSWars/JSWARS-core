var Q, User, Crypto;

Q = require('q');
User = require('../../model/User');
Agent = require('../../model/Agent');

Crypto = require('crypto');

function UserList(req, res) {

	var page = req.params.page || 1;

	if (page < 0) {
		res.status(400).end();
		return;
	}

	var count = req.params.count || 10;

	if (count < 1) {
		res.status(400).end();
		return;
	}

	var promises = [];

	User.find()
		.skip(count * (page - 1))
		.limit(count)
		.lean()
		.exec(function (err, users) {
			if (err) {
				res.status(500).end();
				return;
			}
			for (var useri in users) {
				var user = users[useri];
				if (user.github.avatar_url) {
					user.avatar = user.github.avatar_url;
				} else if (user.github.email) {
					user.avatar = "http://www.gravatar.com/avatar/" + Crypto.createHash('md5').update(user.github.email).digest('hex');
				}
				delete user.github;

				promises.push(Agent.count({user: user._id})
					.then(function (count) {
						user.agents = count;
					}));
			}

			Q.all(promises)
				.then(function () {
					res.status(200).json(users).end();
				})

		});
}

module.exports = UserList;
