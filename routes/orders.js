/**
 * Created by AltonjiC on 9/26/15.
 */

/* Neither of these are correct */

var token_config = require('../config/token');

exports.getOrders = function(req, res, next) {
    res.render('index', { title: 'Orders' });
}

//to get token use line below:
//token = token_config.checkRouteForToken(req,res);

exports.getAll = function(req, res, next) {
    res.render('index', { title: 'Orders all' });
}
