var Q, _, mongoose, AgentVersion, User, Battle;

Q = require("q");
_ = require('underscore');
mongoose = require('mongoose');
AgentVersion = require('../../model/AgentVersion');
User = require('../../model/User');
Battle = require('../../model/Battle');


function AgentVersionListRoute(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	if (user.username !== req.params.username) {
		res.status(400).end();
		return;
	}

	var page = req.query.page || 1;

	if (page < 0) {
		res.status(400).end();
		return;
	}

	var agentId = req.params.id;

	if (agentId === undefined || agentId.trim().length === 0) {
		//Todo: Check valid code!
		res.status(400).json({error: 'ID_REQUIRED'}).end();
		return;
	}

	var query = {
		agent: agentId
	};

	var options = {
		sort: "-moment",
		lean: true,
		page: page,
		limit: 10
	};

	AgentVersion.paginate(query, options)
		.then(function (paginated) {
			var promises = [];
			for (var docIndex in paginated.docs) {
				(function (_docIndex) {
					promises.push(Battle.count({agents: paginated.docs[_docIndex].id}).then(function (count) {
						paginated.docs[_docIndex].battles = count;
					}));
				})(docIndex);
			}

			Q.all(promises).then(function () {
				res.json(paginated);
			});
		});
}
module.exports = AgentVersionListRoute;
