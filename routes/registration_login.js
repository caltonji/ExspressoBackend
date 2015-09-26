/**
 * Created by Mitch Webster on 9/26/2015.
 */
var User = require('../models/user');
var hashing = require('../config/hash');
var jwt = require('jsonwebtoken');
var token_config = require('../config/token');

var login = function(req, res, next) {
    if (!req.body || !req.body.email || !req.body.password) {
        res.json({error: true, body: "Invalid Request"});
    } else {
        User.find({email: req.body.email}, '_id email passwordHash passwordSalt firstName lastName phoneNumber currentRating amountOfRatings', function (err, users) {
            if (err) {
                res.send(err);
            } else {
                if (users.length == 0) {
                    res.json({error: true, body: "Invalid Email/Password"});
                } else {
                    for (var i = 0; i < users.length; i++) {
                        var u = users[i];
                        var potentialHash = hashing.calculateHash(u.passwordSalt + req.body.password);
                        if (u.passwordHash == potentialHash) {
                            u.passwordHash = null;
                            u.passwordSalt = null;

                            var token = jwt.sign(u, token_config.secret, { expiresInMinutes: 120 });

                            res.json({error: false, body: "Yay! I will now send you a token", token: token});
                        }
                    }
                    res.json({error: true, body: "Invalid Email/Password"});
                }
            }
        });
    }
};

exports.login = login;

exports.register = function(req, res, next) {
    if (!req.body) {
        res.json({error: true, body: "Invalid Request"});
    } else if (!req.body.email || req.body.email.indexOf("@gatech.edu") == -1) {
        res.json({error: true, body: "Gatech Email is required"});
    } else if (!req.body.password) {
        res.json({error: true, body: "Password is required"});
    } else if (!req.body.firstName ) {
        res.json({error: true, body: "First Name is required"});
    } else if (!req.body.lastName ) {
        res.json({error: true, body: "Last Name is required"});
    } else if (!req.body.phoneNumber ) {
        res.json({error: true, body: "Phone Number is required"});
    } else {
        User.find({email: req.body.email}, '_id ', function (err, users) {
            if (err) {
                res.send(err);
            } else {
                console.log(users);
                if (users.length > 0) {
                    res.json({error: true, body: "This Email already exists"});
                } else {

                    var user = new User();
                    user.firstName = req.body.firstName;
                    user.lastName = req.body.lastName;
                    user.email = req.body.email;
                    user.phoneNumber = req.body.phoneNumber;

                    user.passwordSalt = hashing.createSalt(req.body.email);
                    user.passwordHash = hashing.calculateHash(user.passwordSalt + req.body.password);

                    console.log("hello world");

                    user.save(function(err) {
                        if (err) {
                            res.json({error: true, body: err})
                        }
                        console.log("Got Here");
                        login(req, res, next);
                    });
                    //res.json({error: true, body: "No users found"});
                }
            }
        });
    }
}