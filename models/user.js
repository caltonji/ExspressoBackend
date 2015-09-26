/**
 * Created by Mitch Webster on 9/25/2015.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//var enumTypes = 'xxxx yyyyy'.split(' ');

var UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},//must be a GT email
    phoneNumber: {type: String, required: true},
    passwordHash: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    currentRating: {type: Number, default: 0},
    amountOfRatings: {type: Number, default: 0},
    dateCreated: {type: Date, default: Date.now},
    lastLogin: {type: Date, default: Date.now},
    deliverActive: {type: Boolean, default: false} //deliverActive = 0 = not waiting for deliveries, 1 = waiting on deliveries
});

var User = mongoose.model("User", UserSchema);

User.schema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'The e-mail must be a valid address');

module.exports = User;