var _, AgentVersion, User;

_ = require('underscore');
AgentVersion = require('../../model/AgentVersion');
User = require('../../model/User');

function AgentVersionListRoute(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	if (user.username !== req.params.username) {
		res.status(400).end();
		return;
	}

	var agentId = req.params.id;

	if (agentId === undefined || agentId.trim().length === 0) {
		//Todo: Check valid code!
		res.status(400).json({error: 'ID_REQUIRED'}).end();
		return;
	}

	AgentVersion.find({
		agent: agentId
	})
		.sort('-moment')
		.lean()
		.exec(function (err, versions) {
			if (err || versions.length === 0) {
				res.status(500).json({error: 'ERROR_RECOVERING_AGENT_VERSIONS'}).end();
				return;
			}
			res.json(versions);
		});
}
module.exports = AgentVersionListRoute;
