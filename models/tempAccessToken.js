var mongoose = require('mongoose');
var moment = require('moment');

var tempAccessTokenSchema = mongoose.Schema({
    expired: [Number],
    created: {type: Date, default: moment.utc()}
});

module.exports = mongoose.model('tempAccessToken', tempAccessTokenSchema);