/**
 * Created by Mitch Webster on 9/25/2015.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MenuItemSchema = new Schema({
    name: {type: String, required: true},
    price_mapping: {
        "Tall": {type: Number, required: true},
        "Grande": {type: Number, required: true},
        "Venti": {type: Number, required: true}
    },
    desc: {type: String, required: true}
});

var MenuItem = mongoose.model("MenuItem", MenuItemSchema);
module.exports = MenuItem;