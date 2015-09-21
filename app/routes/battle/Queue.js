
function Map(req, res) {

	var username = req.params.username;

	if (username === undefined || username.trim().length === 0) {
		res.status(401).end();
	}

	var name = req.body.name;
	var code = req.body.code;

}
module.exports = Map;
