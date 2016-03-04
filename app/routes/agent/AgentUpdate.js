var ObjectId, vm, Agent, AgentVersion;

ObjectId = require('mongoose').Types.ObjectId;
vm = require('vm');
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
		res.status(400).json({errorId: 'CODE_REQUIRED'}).end();
		return;
	}

	var codeScript;
	try {
		codeScript = new vm.Script(code);
	} catch (e) {
		res.status(400).json({
				errorId: 'INVALID_SYNTAX',
				exceptionMessage: e.message
			}
		);
		return;
	}
	var sandbox = new vm.createContext({
		hasInit: false,
		hasTick: false
	});
	var hasScript = new vm.Script('hasInit = typeof init === "function";hasTick = typeof tick === "function"; ');
	try {
		codeScript.runInContext(sandbox);
		hasScript.runInContext(sandbox);
	} catch (e) {
		res.status(400).json({
				errorId: 'INVALID_CODE',
				exceptionMessage: e.message
			}
		);
		return;
	}

	if (sandbox.hasInit == false || sandbox.hasTick == false) {
		res.status(400).json({
				errorId: 'NO_INIT_OR_TICK_FUNCTION'
			}
		);
		return;
	}


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

			var agentVersionEntity = new AgentVersion({
				agent: agent._id,
				moment: new Date(),
				code: code
			});

			agentVersionEntity.save(function (err) {
				if (err) {
					res.status(500).json({errorId: 'ERROR_CREATING_VERSION'}).end();
					return;
				}
				res.status(201).json(agentVersionEntity);
			});

		});

}
module.exports = AgentUpdateRoute;
