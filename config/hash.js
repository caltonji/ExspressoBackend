/**
 * Created by Mitch Webster on 9/26/2015.
 */
var crypto = require('crypto');

function myHash(username, password) {
    var encrypt = crypto.createHash('sha512');
    var data = username.substring(0, username.length/2) + password; //TODO: may want to change the salt
    encrypt.update(data);
    return encrypt.digest('hex');
}

module.exports = {
    calculateHash: myHash
};