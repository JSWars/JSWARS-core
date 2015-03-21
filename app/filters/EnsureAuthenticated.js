// test authentication
function EnsureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).end();
    }
}

module.exports = EnsureAuthenticated;