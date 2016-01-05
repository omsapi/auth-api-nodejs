var config = require('omsapi-config');
var shortid = require('shortid');
var jwt = require('jsonwebtoken');

function create(req, res, next) {
    var refreshToken = req.refreshToken;
    var maxSessions = config.getInt('token:maxSessions', 10);
    var payload = createTokenPayload(refreshToken);

    if (refreshToken.tokens.length >= maxSessions) {
        refreshToken.tokens.shift();
    }

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