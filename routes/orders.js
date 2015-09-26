/**
 * Created by AltonjiC on 9/26/15.
 */

var mongoose = require('mongoose');

var Order = mongoose.model('Order');
var MenuItem = mongoose.model('MenutItem');
var OrderItem = mongoose.model('OrderItem');

var ObjectId = require('mongoose').Types.ObjectId;

/* Neither of these are correct */

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
        MenuItem.findOne({_id: new ObjectId(item[menu_item])}).exec(function(err, doc) {
            if (err || !doc) return null;
            var orderItem = new OrderItem();
            orderItem.menuItem = doc;
            orderItem.size = item.size;
            orderItem.save(function(err, savedItem) {
                if (err) {
                    console.log("error: ", err);
                    return null;
                }
                order_items[i] = savedItem;
            });
        });
    }
}