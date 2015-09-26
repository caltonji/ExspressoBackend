/**
 * Created by Mitch Webster on 9/26/2015.
 */
var User = require('../models/user');
var hashing = require('../../config/hash');
var jwt = require('jsonwebtoken');
var token_config = require('../../config/token');

exports.login = function(req, res, next) {
    if (!req.body || !req.body.email || !req.body.password) {
        res.json({error: true, body: "Invalid Request"});
    } else {
        User.find({email: req.body.email}, '_id email passwordHash status access.admin access.clean access.body access.phil access.fines access.referrals', function (err, users) {


            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            email: {type: String, required: true},//must be a GT email
            phoneNumber: {type: String, required: true},
            passwordHash: {type: String, required: true},
            passwordSalt: {type: String, required: true},
            currentRating: {type: Number, required: true},
            amountOfRatings: {type: Number, required: true},
            dateCreated: {type: Date, default: Date.now},
            lastLogin: {type: Date, default: Date.now}






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
}