/**
 * Created by Mitch Webster on 9/26/2015.
 */

var c2d = function (x){
    return (x / 100).toFixed(2);
};

module.exports = {
    centsToDollars: c2d
};