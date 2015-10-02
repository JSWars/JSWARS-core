function AgentOutput() {
	this.unitActions = [];

}

AgentOutput.prototype.unit = function (_unitId) {
	var _self = this;
	var unitId = _unitId;
	return {
		addAction: function (action) {
			if(_self.unitActions[unitId] === undefined){
				_self.unitActions[unitId] = {};
			}
		}
	}
};


module.exports = AgentOutput;
