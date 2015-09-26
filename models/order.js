/**
 * Created by Mitch Webster on 9/25/2015.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderStatusTypes = 'Created Accepted InProgress Completed CanceledUser CanceledSys Failed'.split(' ');
var OrderItemTypes = 'Tall Grande Venti'.split(' ');
var blameTypes = 'DeliverAccepted CustomerAccepted DeliverNoAccept CustomerNoAccept Both'.split(' ');

var OrderSchema = new Schema({
    status: {type: String, enum: orderStatusTypes, default: 'Created'},
    dateCreated: {type: Date, default: Date.now},
    dateAccepted: {type: Date},
    dateCompleted: {type: Date},
    dateLastStatusChange: {type: Date, default: Date.now},
    blame: {type: String, enum: blameTypes},
    items: [
        {
            menuItem: {type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem'},
            size: {type: String, enum: OrderItemTypes}
        }
    ],
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    deliverer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    location: {type: String, required: true},
    notes: {type: String, default: ""},
    tip: {type: Number, required: true, min: 50},
    reviews: [
        {
            review_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Review'},
            submitted_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        }
    ],
    star_count: {type: Number, default: 0},
    confirmations: {
        customer: {type: Boolean, default: false},
        deliverer: {type: Boolean, default: false}
    }
});

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;