var JwtStrategy = require('passport-jwt').Strategy;
var shortid = require('shortid');
var config = require('omsapi-config');

var RefreshToken = require('../../models/refreshToken');

module.exports = function (passport) {
    passport.use('refresh-token',
        new JwtStrategy({
            secretOrKey: config.get('token:refreshSecret'),
            passReqToCallback: true
        }, function (req, payload, done) {
            //TODO: Move to MW as remove
            var token = shortid.generate();
            RefreshToken.findOneAndUpdate(
                {_id: payload.userId, tokens: payload.token},
                {
                    $set: {'tokens.$': token}
                },
                {
                    new: true
                },
                function (err, refreshToken) {
                    if (err) {
                        return done(err);
                    }

                    if (refreshToken) {
                        req.token = token;
                        return done(null, refreshToken);
                    }

                    done(null, false);
                });
        }));
};
