/**
 * Created by AltonjiC on 9/26/15.
 */

/* Neither of these are correct */

var Order = require('../models/order');
var Review = require('../models/review');
var token_config = require('../config/token');

exports.getOrders = function(req, res, next) {
    res.render('index', { title: 'Orders' });
}

//to get token use line below:
//

exports.getAll = function(req, res, next) {
    res.render('index', { title: 'Orders all' });
}



exports.submitOrderReview = function(req, res, next) {
    //route to submit a review
    if (!req.body) {
        res.json({error: true, body: "Invalid Request"});
    } else if (!req.body.orderID) {
        res.json({error: true, body: "An orderID is required"});
    } else if (!req.body.stars && req.body.isInteger() && req.body.stars >= 0 && req.body.stars <= 5) {
        res.json({error: true, body: "An orderID is required"});
    } else if (!req.body.comment) {
        res.json({error: true, body: "An orderID is required"});
    }   else {
        token = token_config.checkRouteForToken(req,res);
        if (token) {
            Order.findById(orderID, function(err, order) {
                if (err) {
                    res.json({error: error, body: err});
                }
                if (order.reviews.length >= 2) {
                    res.json({error: true, body: "You can't add another review, you can change your old one though"});
                } else {
                    if (order.customer != token._id && order.deliverer != token._id) {
                        //neither of the people placed this order
                        res.json({error: true, body: "You are not involved with this order"});
                        return;
                    }
                    //the owner of this token is somehow involved
                    order.reviews.forEach(function(review) {
                        if (review.customer == token._id || review.deliverer == token._id) {
                            res.json({error: true, body: "You can't add another review, you can change your old one though"});
                            return;
                        }
                    });

                    var type = forDeliver;
                    if (order.customer == token._id) {
                        //the customer is submitting a review
                        type = forCustomer;
                    }

                    var rev = new Review();
                    rev.type = type;
                    rev.stars = req.body.stars;
                    rev.comment = req.body.comment;
                    rev.customer = order.customer;
                    rev.deliverer = order.deliverer;

                    rev.save(function(err) {
                        if (err) {
                            res.json({error: true, body: err})
                        }
                        res.json({error: false, body: "Successfully created review"});
                    });
                }
            });
        } else {
            res.json({error: true, body: "You can't eat your puddin' if you don't have any tokens"});
        }
    }
}