var _, mongoose, Q, Battle, Agent, Map, User;

_ = require('underscore');
mongoose = require('mongoose');
Q = require("q");
Battle = require('../../model/Battle');
Agent = require('../../model/Agent');
Map = require('../../model/Map');

function List(req, res) {


	var page = req.query.page || 1;

	if (page < 0) {
		res.status(400).end();
		return;
	}

	var promises = [];

	var options = {
		sort: "-moment",
		lean: true,
		page: page || 1
	};

	Battle.paginate({}, options)
		.then(function (paginated) {
			var paginatedResponse = _.extend({}, paginated);
			for (var docIndex in paginatedResponse.docs) {
				(function (_docIndex) {
					promises.push(Map.findOne({"_id": paginatedResponse.docs[docIndex].map})
						.select("-data")
						.lean(true)
						.then(function (map) {
							if (!_.isNull(map))
								paginatedResponse.docs[_docIndex].map = map;
						}));
					promises.push(Agent.find({
						_id: {$in: paginatedResponse.docs[_docIndex].agents}
					})
						.populate('user')
						.lean()
						.then(function (agents) {
							paginatedResponse.docs[_docIndex].agents = agents;
							for (var agentIndex in paginatedResponse.docs[_docIndex].agents) {
								delete paginatedResponse.docs[_docIndex].agents[agentIndex].user.github;
							}
						}));
				})(docIndex);
			}

			Q.allSettled(promises).then(function () {
				res.json(paginatedResponse);
			});

		});
}

module.exports = List;
