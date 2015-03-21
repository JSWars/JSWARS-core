var FS;


FS = require('fs');

function Map(req, res) {


	FS.readFile('app/resources/chunk.json', function (err, data) {
		if (err) throw err;
		res.json(JSON.parse(data));
	});




}
module.exports = Map;
