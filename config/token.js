/**
 * Created by Mitch Webster on 9/26/2015.
 */
module.exports = {
    secret: "ourSecretGoesHere", //TODO: change the secret
    checkRouteForToken: function (req, res) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (!token &&  req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            jwt.verify(token, token_config.secret, function(err, decoded) {
                if (err) {
                    return null;
                    //return res.status(403).send({
                    //    error: true,
                    //    message: 'Invalid Credentials.'
                    //});
                } else {
                    return token;
                }
            });

        } else {
            return null;
            //return res.status(403).send({
            //    error: true,
            //    message: 'No token provided.'
            //});
        }
    }
};