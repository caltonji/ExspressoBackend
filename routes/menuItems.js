/**
 * Created by AltonjiC on 9/26/15.
 */
var mongoose = require('mongoose');

var MenuItem = mongoose.model('MenuItem');
var ObjectId = require('mongoose').Types.ObjectId;
var token_config = require('../config/token');
var math_help = require('../config/handlingDecimals');

exports.makeMenuItem = function(req, res, next) {
    var menuItem = new MenuItem();
    menuItem.name = "coffee";
    menuItem.price_mapping = {Tall: 150, Grande:200, Venti:250};
    menuItem.desc = "It's dope dude I swear";
    menuItem.save(function(err, doc) {
        if (err) {
            res.json({error:true, body:err});
        } else {
            res.json({added:doc});
        }
    });
}


exports.getMenuItems = function (req, res, next) {
    token_config.checkRouteForToken(req, res, function (req, res, token) {
        if (token) {
            MenuItem.find({},function(err, items) {
                if (err) {
                    res.json({error: true, body: "error in accessing db"});
                } else {

                    for (var i = 0; i < items.length; i++) {
                        items[i].price_mapping.Tall = math_help.centsToDollars(items[i].price_mapping.Tall);
                        items[i].price_mapping.Grande = math_help.centsToDollars(items[i].price_mapping.Grande);
                        items[i].price_mapping.Venti = math_help.centsToDollars(items[i].price_mapping.Venti);
                    }

                    res.json({error:false, body:null, menu_items: items});
                }
            });
        } else {
            res.json({error: true, body: "no token, no menu"});
        }
    });
}