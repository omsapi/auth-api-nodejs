var mongoose = require('mongoose');

var tempAccessTokenSchema = mongoose.Schema({
    expired: [Number],
    created: Date
});

module.exports = mongoose.model('tempAccessToken', tempAccessTokenSchema);