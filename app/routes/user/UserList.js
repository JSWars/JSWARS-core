var Q, User, Crypto;

_ = require('underscore');
Q = require('q');
User = require('../../model/User');
Agent = require('../../model/Agent');

Crypto = require('crypto');

function UserList(req, res) {

	var page = req.query.page || 1;

	if (page < 0) {
		res.status(400).end();
		return;
	}

	var promises = [];


	var options = {
		lean: true,
		page: page || 1
	};


	User.paginate({}, options)
		.then(function (paginated) {
			var paginatedResponse = _.extend({}, paginated);
			for (var docIndex in paginatedResponse.docs) {
				(function (_docIndex) {


					if (paginatedResponse.docs[_docIndex].github.avatar_url) {
						paginatedResponse.docs[_docIndex].avatar = paginatedResponse.docs[_docIndex].github.avatar_url;
					} else if (paginatedResponse.docs[_docIndex].github.email) {
						paginatedResponse.docs[_docIndex].avatar = "http://www.gravatar.com/avatar/" + Crypto.createHash('md5').update(paginatedResponse.docs[_docIndex].github.email).digest('hex');
					}
					delete paginatedResponse.docs[_docIndex].github;


					promises.push(Agent.count({user: paginatedResponse.docs[_docIndex]._id})
						.then(function (count) {
							paginatedResponse.docs[_docIndex].agents = count;
						}));
				})(docIndex);
			}

			Q.all(promises)
				.then(function () {
					res.status(200).json(paginatedResponse).end();
				})

		});

}

module.exports = UserList;
