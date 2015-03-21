var User;

User = require('../model/User');

function UserRoute(req, res) {

    User.findOne({
            username: req.params.username
        }
    ).exec(function (err, user) {
            if(err){
                //Something going wrong during database call :(
                res.status(500).end();
                return;
            }

            if(user){
                res.json(user);
            }else{
                res.status(404).end();
            }
        });
}

module.exports = UserRoute;