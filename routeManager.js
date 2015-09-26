/**
 * Created by AltonjiC on 9/26/15.
 */
var express = require('express');
var router = express.Router();

//web token code
var jwt = require('jsonwebtoken');
var token_config = require('/config/token');





app.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token &&  req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        jwt.verify(token, token_config.secret, function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    error: true,
                    message: 'Invalid Credentials.'
                });
            } else {
                //TODO Check the expiration date
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            error: true,
            message: 'No token provided.'
        });
    }
});



/*
    Order Routing will go here
 */
var orderRoute = require('./routes/orders');

router.get('/orders', orderRoute.getOrders);
router.get('/orders/all', orderRoute.getAll);

module.exports = router;