/**
 * Created by AltonjiC on 9/26/15.
 */
var express = require('express');
var router = express.Router();

/*
 Registration Routing will go here
 */
var logRoute = require('./routes/registration_login');

router.post('/login', logRoute.login);
router.post('/register', logRoute.register);



/*
    Order Routing will go here
 */
var orderRoute = require('./routes/orders');

router.get('/orders', orderRoute.get);
router.post('/orders/new', orderRoute.new);

module.exports = router;