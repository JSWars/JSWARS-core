var ObjectId, Agent, AgentVersion;

ObjectId = require('mongoose').Types.ObjectId;
Agent = require('../../model/Agent');
AgentVersion = require('../../model/AgentVersion');

//fs.writeFile("/tmp/test", "Hey there!", function(err) {
//    if(err) {
//        console.log(err);
//    } else {
//        console.log("The file was saved!");
//    }
//});

function AgentDetailRoute(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	if (user.username !== req.params.username) {
		res.status(400).end();
		return;
	}

	var agentId = req.params.id;
	var versionId = req.params.versionId;


	if (agentId === undefined || agentId.trim().length === 0) {
		//Todo: Check valid code!
		res.status(400).json({error: 'ID_REQUIRED'}).end();
		return;
	}

	if (versionId === undefined || versionId.trim().length === 0) {
		//Todo: Check valid code!
		res.status(400).json({error: 'VERSION_ID_REQUIRED'}).end();
		return;
	}

	Agent.findById(agentId)
		.exec(function (err, agent) {
			if (err) {
				res.status(500).json({error: 'ERROR_RECOVERING_AGENT'}).end();
				return;
			}
			if (agent === null) {
				res.status(404).end();
				return;
			}
			AgentVersion.findById(versionId)
				.lean()
				.exec(function (err, versions) {
					if (err || versions.length === 0) {
						res.status(500).json({error: 'ERROR_RECOVERING_AGENT_VERSIONS'}).end();
						return;
					}
					res.json(versions);
				});
		});

}
module.exports = AgentDetailRoute;
