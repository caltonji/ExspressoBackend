/**
 * Created by Mitch Webster on 9/25/2015.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ReviewTypes = 'forCustomer forDeliver'.split(' ');

var ReviewSchema = new Schema({
    type: {type: String, enum: ReviewTypes},
    stars: {type: Number, required: true, min: 0, max: 5},
    comment: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now},
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    deliverer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;