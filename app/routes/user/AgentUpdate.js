var ObjectId, Agent, AgentVersion;

ObjectId = require('mongoose').Types.ObjectId;
Agent = require('../../model/Agent');
AgentVersion = require('../../model/AgentVersion');

function AgentUpdateRoute(req, res) {

    //Check user is logged
    var user = req.session.internalUser;

    if (user.username !== req.params.username) {
        res.status(401).end();
        return;
    }

    var code = req.body.code;

    if (code === undefined || code.trim().length === 0) {
        //Todo: Check valid code!
        res.status(400).json({error: 'CODE_REQUIRED'}).end();
        return;
    }

    var agentId = req.params.id;


    if (agentId === undefined || agentId.trim().length === 0) {
        //Todo: Check valid code!
        res.status(400).json({error: 'ID_REQUIRED'}).end();
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

			 var newAgentVersion = new AgentVersion({
				 agent: agent._id,
				 code: code
			 });

			 newAgentVersion.save(function (err) {
				 if(err){
					 res.status(500).json({error: 'ERROR_CREATING_VERSION'}).end();
					 return;
				 }
				 res.status(201).json(newAgentVersion);
			 });

        });

}
module.exports = AgentUpdateRoute;
