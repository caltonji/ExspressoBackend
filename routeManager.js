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

router.post('/orders/cancel', orderRoute.cancel);
router.post('/orders/accept', orderRoute.accept);
router.post('/orders/start', orderRoute.start);
router.post('/orders/confirm', orderRoute.confirm);

router.post('/orders/submitReview', orderRoute.submitOrderReview);


/*
    Populating Database routes will go here
 */
var menuItemRoutes = require('./routes/menuItems');
router.get('/populate', menuItemRoutes.makeMenuItem);

module.exports = router;