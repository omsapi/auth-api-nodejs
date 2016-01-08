var config = require('omsapi-config');
var shortid = require('shortid');
var moment = require('moment');

var RefreshToken = require('../models/refreshToken');

function createNew(req, res, next) {
    var payload = req.payload;
    var token = shortid.generate();
    var maxSessions = config.getInt('token:maxSessions', 10);

    RefreshToken.findOneAndUpdate(
        {_id: payload.userId},
        {
            $setOnInsert: {
                _id: payload.userId,
                created: moment.utc()
            },
            $push: {
                tokens: {
                    $each: [token],
                    $slice: -maxSessions
                }
            }
        },
        {
            new: true,
            upsert: true
        },
        function (err, refreshToken) {
            if (err) {
                return next(err);
            }

            req.token = token;
            req.refreshToken = refreshToken;
            next();
        });
}

function remove(req, res, next) {
    var refreshToken = req.refreshToken;
    var payload = req.payload;

    refreshToken.tokens.some(function (token, i) {
        if (token == payload.token) {
            refreshToken.tokens.slice(i, 1);
            return true;
        }
        return false;
    });

    next();
}

function removeAll(req, res, next) {
    var refreshToken = req.refreshToken;
    refreshToken.tokens = [];

    next();
}

exports.createNew = createNew;
exports.remove = remove;
exports.removeAll = removeAll;