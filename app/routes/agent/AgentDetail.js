var ObjectId, Agent, AgentVersion;

ObjectId = require('mongoose').Types.ObjectId;
Agent = require('../../model/Agent');
AgentVersion = require('../../model/AgentVersion');


function AgentDetailRoute(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	//if (user.username !== req.params.username) {
	//    res.status(400).end();
	//    return;
	//}

	var agentId = req.params.id;

	if (agentId === undefined || agentId.trim().length === 0) {
		//Todo: Check valid code!
		res.status(400).json({errorId: 'ID_REQUIRED'}).end();
		return;
	}

	Agent.findById(agentId)
		.exec(function (err, agent) {
			if (err) {
				res.status(500).json({errorId: 'ERROR_RECOVERING_AGENT'}).end();
				return;
			}
			if (agent === null) {
				res.status(404).end();
				return;
			}
			res.json(agent);
		});

}
module.exports = AgentDetailRoute;
