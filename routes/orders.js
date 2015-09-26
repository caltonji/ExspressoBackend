/**
 * Created by AltonjiC on 9/26/15.
 */

var mongoose = require('mongoose');

var Order = mongoose.model('Order');
var MenuItem = mongoose.model('MenuItem');
var OrderItem = mongoose.model('OrderItem');

var ObjectId = require('mongoose').Types.ObjectId;

/* Neither of these are correct */

var Order = require('../models/order');
var Review = require('../models/review');
var token_config = require('../config/token');

exports.get = function(req, res, next) {
    token_config.checkRouteForToken(req,res, function(req, res, token) {
        if (token) {
            var id = token._id;

            var queryJson = {};
            var sortJson = {'dateCreated': -1};
            var fieldsString = "status dateLastStatusChange tip reviews location";

            var num_items = req.query.num_items;

            //fix non valid data and make it default values
            if (!num_items || num_items < 0)
                num_items = 20;

            var statusType = req.query.statusType;
            var orderStatusTypes = 'Created Accepted InProgress Completed CanceledUser CanceledSys Failed'.split(' ');

            if (statusType && orderStatusType.indexOf(statusType) > -1)
                queryJson = {"status": statusType};

            var customer = req.query.customer;
            if (customer)
                queryJson[customer] = new ObjectId(customer);

            var deliverer = req.query.deliverer;
            if (deliverer) queryJson[deliverer] = new ObjectId(deliverer);

            //requesting for all users
            Order.find(queryJson).sort(sortJson).limit(num_items).select(fieldsString).exec(function (err, posts) {
                if (err) {
                    res.json({error: true, body: "error in accessing db"});
                } else {
                    res.json(posts);
                }
            });
        } else {
            res.json({error: true, body: "login to view this info"});
        }
    });
}


exports.new = function(req, res, next) {
    token_config.checkRouteForToken(req,res, function(req, res, token) {
        if (token) {
            if (!req.body.items || req.body.items.length <= 0) {
                res.json({error:true, body: "Orders need items"});
            } else if (!req.body.location) {
                res.json({error:true, body: "Orders need a location"});
            } else if (!req.body.tip) {
                res.json({error:true, body: "Orders need a tip"});
            } else {
                checkItems(req.body.items, function(orderItems) {
                    var order = new Order();
                    order.items = orderItems;
                    if (!order.items)
                        res.json({error:true, body: "Problem with items"});
                    order.customer = token._id;
                    order.location = req.body.location;
                    order.tip = req.body.tip;


                    console.log("order: " + order);
                    order.save(function(err, savedOrder) {
                        if (err) {
                            res.json({error: true, body: err});
                        }
                        res.json({SavedOrder: savedOrder});
                    });

                })
            }
        } else {
            res.json({error: true, body: "go get yourself a coupon, come back here, and then we'll talk about your vente frappe, how bout it?"});
        }
    });

}

/*
Returns: an array of valid order_items or null if not valid
 */
var checkItems = function(items, callback) {
    console.log(items);
    var order_items = [];
    var inserted = 0;
    console.log("going to do something");
    for (i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item.menuItem || !item.size) {
            callback(null);
            return;
        }
        console.log("about to look in MenuItem for " + item.menuItem);
        MenuItem.findById(new ObjectId(item.menuItem), function (err, doc) {
            if (err) {
                console.log("error in lookup: " + err);
                callback(null);
                return;
            } else if (!doc) {
                console.log("no such menu item found : " + doc);
                callback(null);
                return;
            }
            var orderItem = new OrderItem();
            orderItem.menuItem = doc;
            orderItem.size = item.size;
            console.log("about to save");
            orderItem.save(function (err, savedItem) {
                if (err) {
                    console.log("error: ", err);
                    callback(null);
                    return;
                }
                order_items[i] = savedItem;
                console.log("got here");
                if (++inserted == items.length) {
                    callback(order_items);
                }
            });
        });
    }
}


exports.submitOrderReview = function (req, res, next) {
    //route to submit a review
    if (!req.body) {
        res.json({error: true, body: "Invalid Request"});
    } else if (!req.body.orderID) {
        res.json({error: true, body: "An orderID is required"});
    } else if (!req.body.stars && req.body.isInteger() && req.body.stars >= 0 && req.body.stars <= 5) {
        res.json({error: true, body: "An orderID is required"});
    } else if (!req.body.comment) {
        res.json({error: true, body: "An orderID is required"});
    } else {
        token = token_config.checkRouteForToken(req, res);
        if (token) {
            Order.findById(orderID, function (err, order) {
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
                    order.reviews.forEach(function (review) {
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

                    rev.save(function (err) {
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


exports.submitOrderReview = function(req, res, next) {
    //route to submit a review
    if (!req.body) {
        res.json({error: true, body: "Invalid Request"});
    } else if (!req.body.orderID) {
        res.json({error: true, body: "An orderID is required"});
    } else if (!req.body.stars || req.body.stars < 0 && req.body.stars > 5) {
        res.json({error: true, body: "A 'X stars' rating is required"});
    } else if (!req.body.comment) {
        res.json({error: true, body: "A comment is required"});
    }   else {
        token_config.checkRouteForToken(req,res,
            submitOrderReviewCallback
        );
    }
};

var submitOrderReviewCallback = function (req, res, token) {
    var orderID = req.body.orderID;

    if (token) {
        Order.findById(orderID, function(err, order) {
            if (err) {
                res.json({error: true, body: err});
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