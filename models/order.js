/**
 * Created by Mitch Webster on 9/25/2015.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderStatusTypes = 'Created Accepted InProgress Completed CanceledUser CanceledSys Failed'.split(' ');

var blameTypes = 'DeliverAccepted CustomerAccepted DeliverNoAccept CustomerNoAccept Both'.split(' ');

var OrderSchema = new Schema({
    status: {type: String, enum: orderStatusTypes},
    dateCreated: {type: Date, default: Date.now},
    dateAccepted: {type: Date},
    dateCompleted: {type: Date},
    blame: {type: String, enum: blameTypes},
    items: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem'}
    ],
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    deliverer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    location: {type: String, required: true},
    notes: {type: String, required: true},
    tip: {type: Number, required: true},
    reviews: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Review'}
    ]
});

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;