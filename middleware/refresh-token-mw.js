var config = require('omsapi-config');
var shortid = require('shortid');
var jwt = require('jsonwebtoken');

var RefreshToken = require('../models/refreshToken');

function initiate(req, res, next) {
    var payload = req.payload;
    RefreshToken.findOneAndUpdate(
        {_id: payload.userId},
        {
            $setOnInsert: {_id: payload.userId}
        },
        {
            new: true,
            upsert: true
        },
        function (err, refreshToken) {
            if (err) {
                return next(err);
            }

            req.refreshToken = refreshToken;
            next();
        });
}

function create(req, res, next) {
    var refreshToken = req.refreshToken;
    var maxSessions = config.getInt('token:maxSessions', 10);

    if (refreshToken.tokens.length >= maxSessions) {
        refreshToken.tokens.shift();
    }

    var payload = createTokenPayload(refreshToken);
    refreshToken.tokens.push(payload.token);

    createJwt(payload, function (jwt) {
        res.locals.refreshJwt = jwt;
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

exports.initiate = initiate;
exports.create = create;
exports.remove = remove;
exports.removeAll = removeAll;


function createTokenPayload(refreshToken) {
    return {
        token: shortid.generate(),
        userId: refreshToken._id
    };
}

function createJwt(payload, callback) {
    var refreshSecret = config.get("token:refreshSecret");
    var refreshTimeout = config.getInt("token:refreshTimeout");
    jwt.sign(payload, refreshSecret, {expiresIn: refreshTimeout}, callback);
}