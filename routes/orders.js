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

//TODO: Add support for paging, add support for multiple options of status types
exports.get = function(req, res, next) {
    token_config.checkRouteForToken(req,res, function(req, res, token) {
        if (token) {
            var id = token._id;

            var queryJson = {};
            var sortJson = {'dateCreated': -1};
            var fieldsString = "status dateLastStatusChange tip reviews location";

            var numOrders = req.query.numOrders;

            //fix non valid data and make it default values
            if (!numOrders) numOrders = 20;
            if (numOrders < 0) {
                res.json({error: true, body:"illegal numOrders value"});
                return;
            }

            var statusType = req.query.statusType;
            var orderStatusTypes = 'Created Accepted InProgress Completed CanceledUser CanceledSys Failed'.split(' ');

            if (statusType && orderStatusTypes.indexOf(statusType) > -1)
                queryJson.status = statusType;

            var customer = req.query.customer;
            if (customer) {
                if (ObjectId.isValid(customer)) {
                    queryJson.customer = new ObjectId(customer);
                } else {
                    res.json({error: true, body: "bad customer value"});
                    return;
                }
            }


            var deliverer = req.query.deliverer;
            if (deliverer) {
                if (ObjectId.isValid(deliverer)) {
                    queryJson.deliverer = new ObjectId(deliverer);
                } else {
                    res.json({error:true,body:"bad deliverer value"});
                    return;
                }
            }
            //requesting for all users
            Order.find(queryJson).sort(sortJson).limit(numOrders).select(fieldsString).exec(function (err, posts) {
                if (err) {
                    res.json({error: true, body: "error in accessing db"});
                } else {
                    res.json({error:false, body:null, orders:posts});
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
                    console.log(orderItems);
                    var order = new Order();
                    order.items = orderItems;
                    if (!order.items) {
                        res.json({error:true, body: "Problem with items"});
                        return;
                    }
                    order.customer = token._id;
                    order.location = req.body.location;
                    order.tip = req.body.tip;


                    console.log("order: " + order);
                    order.save(function(err, savedOrder) {
                        if (err) {
                            res.json({error: true, body: err});
                        }
                        res.json({error:false, body:null, SavedOrder: savedOrder});
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
            orderItem.size = item.size; //TODO: figure out why this is returning null
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
                return;
            }
            if (order) {
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
                        if (review.submitted_by == token._id) {
                            res.json({error: true, body: "You can't add another review, you can change your old one though"});
                            return;
                        }
                    });

                    var type = "forDeliver";
                    if (order.customer == token._id) {
                        //the customer is submitting a review
                        type = "forCustomer";
                    }

                    var rev = new Review();
                    rev.type = type;
                    rev.stars = req.body.stars;
                    rev.comment = req.body.comment;
                    rev.customer = order.customer;
                    rev.deliverer = order.deliverer;

                    order.reviews.push({
                        review_id: rev._id,
                        submitted_by: token._id
                    });

                    rev.save(function(err) {
                        if (err) {
                            res.json({error: true, body: err})
                            return;
                        }
                        order.save(function(err) {
                            if (err) {
                                res.json({error: true, body: err})
                            }
                            res.json({error: false, body: "Successfully created review"});
                        });
                    });
                }
            } else {
                res.json({error: true, body: "No order exists of this type"});
            }
        });
    } else {
        res.json({error: true, body: "You can't eat your puddin' if you don't have any tokens"});
    }
};

exports.cancel = function(req, res, next) {
    token_config.checkRouteForToken(req,res, function(req, res, token) {
        if (token) {
            if (!req.body.orderID) {
                res.json({error:true, body: "Order ID is required"});
            } else if (!req.body.source) {
                res.json({error:true, body: "Source is required"});
            } else {
                Order.findById(req.body.orderID, function(err, order) {
                    if (err) {
                        res.json({error: true, body: err});
                    } else {
                        if (order.customer == user || order.deliverer == user) {
                            if (order.status == "Created") {
                                //does not yet have a deliverer so lets just delete it
                                Order.remove({
                                    _id: req.body.orderID
                                }, function(err, order) {
                                    if (err) {
                                        res.send({error: true, body: err});
                                    }
                                    res.json({ error: false, body: 'Successfully deleted' });
                                });
                            } else {
                                if (order.deliverer == token._id) {
                                    order.deliverer = null;
                                    order.dateAccepted = null;
                                    order.dateCompleted = null;
                                    order.dateLastStatusChange = new Date();
                                    order.status = "Created";
                                    //TODO: alert customer and put it back on queue
                                    order.save(function(err) {
                                        if (err) {
                                            res.json({error: true, body: err})
                                        }
                                        res.json({error: false, body: ""});
                                        return;
                                    });
                                } else {
                                    //TODO: alert customer that they will still be charged
                                }
                            }
                            //order.status = source == "user" ? "CanceledUser" : "CanceledSys";
                            order.dateLastStatusChange = new Date();
                        } else {
                            res.json({error: true, body: "Forbidden"});
                        }
                    }
                });
            }
        } else {
            res.json({error: true, body: "no token, big problem"});
        }
    });
};

exports.accept = function(req, res, next) {
    token_config.checkRouteForToken(req,res, function(req, res, token) {
        if (token) {
            if (!req.body.orderID) {
                res.json({error:true, body: "Order ID is required"});
            } else {
                Order.findById(req.body.orderID, function(err, order) {
                    if (err) {
                        res.json({error: true, body: err});
                    } else {
                        if (order.status == "Created") {
                            order.status = "Accepted";
                            order.dateAccepted = new Date();
                            order.deliverer = token._id;
                            //TODO: let the customer know their order has been accepted (push notifications?)
                            order.save(function(err) {
                                if (err) {
                                    res.json({error: true, body: err})
                                }
                                res.json({error: false, body: ""});
                                return;
                            });
                        } else {
                            res.json({error: true, body: "not applicable"});
                        }
                    }
                });
            }
        } else {
            res.json({error: true, body: "no token, big problem"});
        }
    });
};

exports.start = function(req, res, next) {
    token_config.checkRouteForToken(req,res, function(req, res, token) {
        if (token) {
            if (!req.body.orderID) {
                res.json({error:true, body: "Order ID is required"});
            } else {
                Order.findById(req.body.orderID, function(err, order) {
                    if (err) {
                        res.json({error: true, body: err});
                    } else {
                        if (order.deliverer == token._id && order.status == "Accepted") {
                            order.status = "InProgress";
                            order.dateLastStatusChange = new Date();
                            //TODO: let the customer know their order is in progress(push notifications?)
                            order.save(function(err) {
                                if (err) {
                                    res.json({error: true, body: err})
                                }
                                res.json({error: false, body: ""});
                                return;
                            });
                        } else {
                            res.json({error: true, body: "not applicable"});
                        }
                    }
                });
            }
        } else {
            res.json({error: true, body: "no token, big problem"});
        }
    });
};