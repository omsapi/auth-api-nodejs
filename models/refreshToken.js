var mongoose = require('mongoose');

var refreshTokenSchema = mongoose.Schema({
    tokens: [String],
    created: Date
});

module.exports = mongoose.model('refreshToken', refreshTokenSchema);