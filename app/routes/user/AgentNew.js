var FS, vm, Agent, AgentVersion;

FS = require('fs');
vm = require('vm');
Agent = require('../../model/Agent');
AgentVersion = require('../../model/AgentVersion');


//fs.writeFile("/tmp/test", "Hey there!", function(err) {
//    if(err) {
//        console.log(err);
//    } else {
//        console.log("The file was saved!");
//    }
//});


function AgentNewRoute(req, res) {

	//Check user is logged
	var user = req.session.internalUser;

	if (user.username !== req.params.username) {
		res.status(401).end();
		return;
	}

	var name = req.body.name;
	var code = req.body.code;

	//Validations: Not empty or only space
	if (name === undefined || name.trim().length === 0) {
		res.status(400).json({error: 'NAME_REQUIRED'}).end();
		return;
	}

	if (code === undefined || code.trim().length === 0) {
		//Todo: Check valid code!
		res.status(400).json({error: 'CODE_REQUIRED'}).end();
		return;
	}

	var codeScript;
	try {
		codeScript = new vm.Script(code);
	} catch (e) {
		res.status(400).json({
				errorId: 'INVALID_JAVASCRIPT',
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
	codeScript.runInContext(sandbox);
	hasScript.runInContext(sandbox);

	if(sandbox.hasInit == false || sandbox.hasTick == false){
		res.status(400).json({
				errorId: 'NOT_INIT_OR_TICK_FUNCTION'
			}
		);
		return;
	}


	Agent.count({name: req.body.name}).then(function (count) {
		if (count > 0) {
			res.status(400).json({
					errorId: 'NAME_ALREADY_IN_USE'
				}
			);
			return;
		}

		//Create Agent object and push on it the AgentVersion
		var agentEntity = new Agent({
			name: req.body.name,
			moment: new Date(),
			user: req.session.internalUser._id,
			color: req.body.color
		});

		//Save new Agent
		agentEntity.save(function (err) {
				if (err) {
					res.status(500).json({error: 'AGENT_NOT_SAVED'}).end();
					return;
				}
				var agentVersionEntity = new AgentVersion({
					code: code,
					moment: new Date(),
					agent: agentEntity._id
				});

				agentVersionEntity.save(function (err) {
					if (err) {
						res.status(500).json({error: 'AGENT_VERSION_NOT_SAVED'}).end();
						return;
					}
					res.status(201).json(agentEntity);
				});
			}
		)
		;

	});

}
module.exports = AgentNewRoute;
