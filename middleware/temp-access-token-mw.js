var error = require('omsapi-http-errors');

function check(req, res, next) {
    var tempAcessToken = req.tempAccessToken;
    var payload = req.payload;

    if (tempAcessToken && tempAcessToken.expired >= payload.exp) {
        return next(new error.Forbidden());
    }

    next();
}

exports.check = check;