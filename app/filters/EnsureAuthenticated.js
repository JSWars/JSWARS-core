// test authentication
function EnsureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(403).end();
    }
}

module.exports = EnsureAuthenticated;