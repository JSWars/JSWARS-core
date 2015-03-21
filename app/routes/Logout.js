
function LogoutRoute (req, res) {
    req.logout();
    res.redirect('/');
}
module.exports = LogoutRoute;