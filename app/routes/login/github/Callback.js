var Config, User;

Config = require('../../../config');
User = require('../../../model/User');

function CallbackRoute(req, res) {

	var githubData = req.user._json;

	User.findOne({
			username: githubData.login
		}
	)
		.exec(function (err, user) {
			if (err) {
				//Something going wrong during database call :(
				res.status(500).end();
			}
			if (user === null) { //Create user

				var newUser = new User();
				newUser.name = githubData.name;
				newUser.username = githubData.login;
				newUser.github = githubData;

				//User is not registered
				newUser.save(function (err) {
					if (err) {
						//Database failure
						res.status(500).end();
					}
					//res.json(newUser.toJSON());

					var ret = req.session.return;
					delete req.session.return;
					req.session.internalUser = newUser;
					res.redirect(ret.replace(':username', newUser.username));
				});
			} else {
				var ret = req.session.return;
				delete req.session.return;
				req.session.internalUser = user;
				res.redirect(ret.replace(':username', user.username));
			}
		}, function () {
			//Database failure
			res.status(500).end();
		});
}
module.exports = CallbackRoute;
