/**
 * Created by AltonjiC on 9/26/15.
 */
var mongoose = require('mongoose');

var MenuItem = mongoose.model('MenuItem');
var ObjectId = require('mongoose').Types.ObjectId;

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
    })
}