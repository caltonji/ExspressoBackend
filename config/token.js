/**
 * Created by Mitch Webster on 9/26/2015.
 */
var jwt = require('jsonwebtoken');

var secret_code = "ourSecretGoesHere";

module.exports = {
    secret: secret_code, //TODO: change the secret
    checkRouteForToken: function (req, res, callback) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (!token &&  req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            jwt.verify(token, secret_code, function(err, decoded) {
                if (err) {
                    callback(req, res, null);
                } else {
                    callback(req, res, decoded);
                }
            });

        } else {
            callback(req, res, null);
        }
    }
};


