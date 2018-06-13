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

				var userEntity = new User();
				userEntity.name = githubData.name;
				userEntity.username = githubData.login;
				userEntity.github = githubData;
				userEntity.created = new Date();

				//User is not registered
				userEntity.save(function (err) {
					if (err) {
						//Database failure
						res.status(500).end();
					}
					//res.json(newUser.toJSON());

					var ret = req.session.return;
					delete req.session.return;
					req.session.internalUser = userEntity;
					res.redirect(ret.replace(':username', userEntity.username));
				});
			} else {
				var ret = req.session.return;
				delete req.session.return;
				req.session.internalUser = user;
				user.name = githubData.name;
				user.username = githubData.login;
				user.github = githubData;
				user.save(function(){
					res.redirect(ret.replace(':username', user.username));
				});
			}
		}, function () {
			//Database failure
			res.status(500).end();
		});
}
module.exports = CallbackRoute;
