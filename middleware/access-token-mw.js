var jwt = require('jsonwebtoken');
var config = require('omsapi-config');

function create(req, res, next) {
    var refreshToken = req.refreshToken;
    var payload = createPayload(refreshToken);

    createJwt(payload, function (jwt) {
        res.locals.accessJwt = jwt;
        next();
    });
}

exports.create = create;

function createPayload(refreshToken) {
    return {
        userId: refreshToken._id
    };
}

function createJwt(payload, callback) {
    var accessSecret = config.get("token:accessSecret");
    var accessTimeout = config.getInt("token:accessTimeout");
    jwt.sign(payload, accessSecret, {expiresIn: accessTimeout}, callback);
}