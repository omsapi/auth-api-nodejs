var JwtStrategy = require('passport-jwt').Strategy;
var config = require('omsapi-config');

var RefreshToken = require('../../models/refreshToken');

module.exports = function (passport) {
    passport.use('temp-access-token',
        new JwtStrategy({
            secretOrKey: config.get('token:tempAccessSecret')
        }, function (payload, done) {
            RefreshToken.findOneAndUpdate(
                {_id: payload.userId},
                {$setOnInsert: {_id: payload.userId}},
                {new: true, upsert: true},
                function (err, refreshToken) {
                    if (err) {
                        return done(err);
                    }

                    done(null, refreshToken);
                });
        }));
};
