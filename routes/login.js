/**
 * Created by Mitch Webster on 9/26/2015.
 */
var User = require('../../models/user');

exports.login = function(req, res, next) {
    if (!req.body) {
        res.json({error: true, body: "Invalid Request"});
    } else if (!req.body.email) {
        res.json({error: true, body: "Email is required"});
    } else if (!req.body.password) {
        res.json({error: true, body: "Password is required"});
    } else {
        User.find({email: req.body.email}, '-_id email passwordHash status access.admin access.clean access.body access.phil access.fines access.referrals',function (err, users) {
            if (err) {
                res.send(err);
            } else {
                if (users.length > 1) {
                    console.log("More than one user with same email!!!");
                    res.json({error: true, body: "Internal Error"});
                } else if (users.length == 0) {
                    res.json({error: true, body: "Invalid Email/Password"});
                } else {
                    //TODO: SEND Password encoded
                    var possibleHash = hashing.calculateHash(req.body.email, req.body.password);

                    //res.json(possibleHash);
                    if (possibleHash == users[0].passwordHash) {
                        var temp = users[0];
                        temp.passwordHash = null;
                        var token = jwt.sign(temp, token_config.secret, {
                            expiresInMinutes: 360 // expires in 6 hours
                        });

                        //TODO: FIX EXpiration, not working
                        //update token and send it
                        res.json({error: false, body: "Yay! I will now send you a token", token: token});
                    } else {
                        res.json({error: true, body: "Invalid Email/Password"});
                    }
                }
            }
        });
}
