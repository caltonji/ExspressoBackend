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
          res.json({error:true, body:"Is it necessary that I drink my own tokens, no but it's sterile .... jk it is"});
        }
  });
};

exports.checkIn = function(req, res, next) {
  token_config.checkRouteForToken(req, res, function (req, res, token) {
    if (token) {
      User.findById(token._id, function (err, user) {
        if (err) {
          res.json({error: true, body: err});
        } else {
          if (user.deliverActive) {
            res.json({error: false, body: "User has already checked in"});
          } else {
            user.deliverActive = true;
            user.save(function(err) {
              if (err) {
                res.json({error: true, body: err})
              } else {
                res.json({error: false, body: "Checked In"});
              }
            });
          }
        }
      });
    } else {
      res.json({error:true, body:"Is it necessary that I drink my own tokens, no but it's sterile .... jk it is"});
    }
  });
};

exports.checkOut = function(req, res, next) {
  token_config.checkRouteForToken(req, res, function (req, res, token) {
    if (token) {
      User.findById(token._id, function (err, user) {
        if (err) {
          res.json({error: true, body: err});
        } else {
          if (!user.deliverActive) {
            res.json({error: false, body: "User has is already checked out"});
          } else {
            user.deliverActive = false;
            user.save(function(err) {
              if (err) {
                res.json({error: true, body: err})
              } else {
                res.json({error: false, body: "Checked out"});
              }
            });
          }
        }
      });
    } else {
      res.json({error:true, body:"Is it necessary that I drink my own tokens, no but it's sterile .... jk it is"});
    }
  });
};

exports.currentActive = function(req, res, next) {
  token_config.checkRouteForToken(req, res, function (req, res, token) {
    if (token) {
      User.find({deliverActive: true}, function (err, users) {
        if (err) {
          res.json({error: true, body: err});
        } else {
          res.json({error: true, body: "No Error Here", total: users.length});
        }
      });
    } else {
      res.json({error:true, body:"Is it necessary that I drink my own tokens, no but it's sterile .... jk it is"});
    }
  });
};