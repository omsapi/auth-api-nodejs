var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var shortid = require('shortid');
var config = require('omsapi-config');

var RefreshToken = require('../../models/refreshToken');

module.exports = function (passport) {
    passport.use('refresh-update',
        new JwtStrategy({
            secretOrKey: config.get('token:refreshSecret'),
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromAuthHeader()
        }, function (req, payload, done) {
            var token = shortid.generate();

            removeToken(payload, function (err, refreshToken) {
                if (err) {
                    return done(err);
                }

                if (!refreshToken) {
                    return done(null, false);
                }

                addNewToken(token, refreshToken, function (err) {
                    if (err) {
                        return done(err);
                    }

                    req.token = token;
                    return done(null, refreshToken);
                })
            });
        }));

    passport.use('refresh-remove',
        new JwtStrategy({
            secretOrKey: config.get('token:refreshSecret'),
            jwtFromRequest: ExtractJwt.fromAuthHeader()
        }, function (payload, done) {
            removeToken(payload, function (err, refreshToken) {
                if (err) {
                    return done(err);
                }

                if (!refreshToken) {
                    return done(null, false);
                }

                return done(null, refreshToken);
            });
        }));

    passport.use('refresh-remove-all',
        new JwtStrategy({
            secretOrKey: config.get('token:refreshSecret'),
            jwtFromRequest: ExtractJwt.fromAuthHeader()
        }, function (payload, done) {
            removeAllTokens(payload, function (err, refreshToken) {
                if (err) {
                    return done(err);
                }

                if (!refreshToken) {
                    return done(null, false);
                }

                return done(null, refreshToken);
            });
        }));
};

function removeToken(payload, callback) {
    RefreshToken.findOneAndUpdate(
        {_id: payload.userId, tokens: payload.token},
        {
            $pull: {tokens: payload.token}
        },
        {
            new: true
        },
        function (err, refreshToken) {
            if (err) {
                return callback(err);
            }

            callback(null, refreshToken);
        });
}

function removeAllTokens(payload, callback) {
    RefreshToken.findOneAndUpdate(
        {_id: payload.userId, tokens: payload.token},
        {
            $push: {
                tokens: {
                    $each: [],
                    $slice: 0
                }
            }
        },
        {
            new: true
        },
        function (err, refreshToken) {
            if (err) {
                return callback(err);
            }

            callback(null, refreshToken);
        });
}

function addNewToken(newToken, refreshToken, callback) {
    refreshToken.update(
        {
            $push: {tokens: newToken}
        },
        function (err) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
}

