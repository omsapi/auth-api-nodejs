var JwtStrategy = require('passport-jwt').Strategy;
var config = require('omsapi-config');

var RefreshToken = require('../../models/refreshToken');

module.exports = function (passport) {
    passport.use('refresh-token',
        new JwtStrategy({
            secretOrKey: config.get('token:refreshSecret'),
            passReqToCallback: true
        }, function (req, payload, done) {
            RefreshToken.findOne({_id: payload.userId, tokens: payload.token}, function (err, refreshToken) {
                if (err) {
                    return done(err);
                }

                if (refreshToken) {
                    req.payload = payload;
                    return done(null, refreshToken);
                }

                done(null, false);
            });
        }));
};
