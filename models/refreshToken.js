var mongoose = require('mongoose');
var moment = require('moment');

var refreshTokenSchema = mongoose.Schema({
    tokens: [String],
    created: {type: Date, default: moment.utc()}
});

module.exports = mongoose.model('refreshToken', refreshTokenSchema);