var mongoose = require('mongoose');
var moment = require('moment');

console.warn('!!!TODO: tempAccessTokenSchema: expired - sort array (max length 2)!!!');
var tempAccessTokenSchema = mongoose.Schema({
    expired: [Number],
    created: {type: Date, default: moment.utc()}
});

module.exports = mongoose.model('tempAccessToken', tempAccessTokenSchema);