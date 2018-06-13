var _ = require("underscore");

function AgentOutput() {
	this.actions = {};
}

AgentOutput.ACTIONS = {
	"moveTo": "moveTo",
	"attackTo": "attackTo"
};

AgentOutput.prototype.unit = function (_unitId) {
	var _self = this;
	var unitId = _unitId;
	return {
		addAction: function (action, angle) {
			if (!_.isUndefined(AgentOutput.ACTIONS[action])) {
				_self.actions[unitId] = _self.actions[unitId] || {};
				_self.actions[unitId][action] = angle;
			}
		}
	}
};


module.exports = AgentOutput;
