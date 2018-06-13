var User;


/**
 * Route to obtain current status
 *
 * @constructor
 */
function Status(req, res) {
		res.json({
			status: true
		});
}

module.exports = Status;
