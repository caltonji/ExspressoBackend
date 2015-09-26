var mongoose = require('mongoose');
var User = mongoose.model('User');
var ObjectId = require('mongoose').Types.ObjectId;
var token_config = require('../config/token');

/* GET users listing. */
exports.myInfo = function(req, res, next) {
  token_config.checkRouteForToken(req, res, function (req, res, token) {
    if (token) {
      User.findById(token._id, '_id email firstName lastName phoneNumber currentRating amountOfRatings', function (err, user) {
        if (err) {
          res.json({error: true, body: err});
        } else {
          res.json({error: false, body: null, user: user});
        }
      });
    } else {
          res.json({error:false, body:null, SavedOrder: savedOrder});
        }
  });
}
