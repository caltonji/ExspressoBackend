/**
 * Created by AltonjiC on 9/26/15.
 */

/* Neither of these are correct */

exports.getOrders = function(req, res, next) {
    res.render('index', { title: 'Orders' });
}

exports.getAll = function(req, res, next) {
    res.render('index', { title: 'Orders all' });
}
