/**
 * Created by Mitch Webster on 9/26/2015.
 */
var crypto = require('crypto');

function createSalt(data) {
     return data.substring(0, data.length/2);
}

function myHash(data) {
    var encrypt = crypto.createHash('sha512');
    encrypt.update(data);
    return encrypt.digest('hex');
}

module.exports = {
    calculateHash: myHash,
    createSalt: createSalt
};