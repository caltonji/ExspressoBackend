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
    var token = token_config.checkRouteForToken(req,res);
    if (token) {
        var id = token._id;

        var queryJson = {};
        var sortJson = {'dateCreated' : -1};
        var fieldsString = "status dateLastStatusChange tip reviews";

        var num_items = req.query.num_items;

        //fix non valid data and make it default values
        if (!num_items || num_items < 0)
            num_items = 20;

        var statusType = req.query.statusType;
        var orderStatusTypes = 'Created Accepted InProgress Completed CanceledUser CanceledSys Failed'.split(' ');

        if (statusType && orderStatusType.indexOf(statusType) > -1)
            queryJson = {"status" : statusType};

        var customer = req.query.customer;
        if (customer)
            queryJson[customer] = new ObjectId(customer);

        var deliverer = req.query.deliverer;
        if (deliverer) queryJson[deliverer] = new ObjectId(deliverer);

        //requesting for all users
        Order.find(queryJson).sort(sortJson).limit(num_items).select(fieldsString).exec(function(err, posts) {
            if (err) {
                res.json({error : true, body: "error in accessing db"});
            } else {
                res.json(posts);
            }
        });
    } else {
        res.json({error:true,body:"login to view this info"});
    }
}


exports.new = function(req, res, next) {
    var token = token_config.checkRouteForToken(req,res);
    if (token) {
        if (!req.query.items || req.query.items.length <= 0) {
            res.json({error:true, body: "Orders need items"});
        } else if (!req.query.location) {
            res.json({error:true, body: "Orders need a location"});
        } else if (!req.query.tip) {
            res.json({error:true, body: "Orders need a tip"});
        } else {
            var order = new Order();
            order.customer = token._id;
            order.location = req.query.location;
            order.tip = req.query.tip;
            order.items = checkItems(req.query.items);
            if (!order.items)
                res.json({error:true, body: "Something went wrong"});
            order.save(function(err, savedOrder) {
                if (err) {
                    res.json({error: true, body: err});
                }
                res.json({SavedOrder: savedOrder});
            });
        }
    } else {
        res.json({error: true, body: "go get yourself a coupon, come back here, and then we'll talk about your vente frappe, how bout it?"});
    }
}

/*
Returns: an array of valid order_items or null if not valid
 */
var checkItems = function(items) {
    var order_items = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item.menu_item || !item.size) return null;
        MenuItem.findOne({_id: new ObjectId(item[menu_item])}).exec(function (err, doc) {
            if (err || !doc) return null;
            var orderItem = new OrderItem();
            orderItem.menuItem = doc;
            orderItem.size = item.size;
            orderItem.save(function (err, savedItem) {
                if (err) {
                    console.log("error: ", err);
                    return null;
                }
                order_items[i] = savedItem;
            });
        });


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
    }
}