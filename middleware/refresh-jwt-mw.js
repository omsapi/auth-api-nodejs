var config = require('omsapi-config');
var jwt = require('jsonwebtoken');

function create(req, res, next) {
    var userId = req.refreshToken._id;
    var token = req.token;

    var payload = createTokenPayload(userId, token);

    createJwt(payload, function (jwt) {
        res.locals.refreshJwt = jwt;
        next();
    });
}

exports.create = create;

function createTokenPayload(userId, token) {
    return {
        userId: userId,
        token: token
    };
}

function createJwt(payload, callback) {
    var refreshSecret = config.get("token:refreshSecret");
    var refreshTimeout = config.getInt("token:refreshTimeout");

    jwt.sign(payload, refreshSecret, {expiresIn: refreshTimeout}, callback);
}