var mongoose = require('mongoose');

var schema = mongoose.Schema({
    field: String,
    created: Date
});

module.exports = mongoose.model('myModel', schema);