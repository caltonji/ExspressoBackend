/**
 * Created by AltonjiC on 9/26/15.
 */
var express = require('express');
var router = express.Router();

/*
    Order Routing will go here
 */
var orderRoute = require('./routes/orders');

router.get('/orders', orderRoute.getOrders);
router.get('/orders/all', orderRoute.getAll);

module.exports = router;