/**
 * Created by Mitch Webster on 9/25/2015.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderItemTypes = 'Tall Grande Venti'.split(' ');

var OrderItemSchema = new Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem'},
    size: {type: String, enum: OrderItemTypes}
});

var OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = OrderItem;