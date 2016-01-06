var JwtStrategy = require('passport-jwt').Strategy;
var config = require('omsapi-config');

var TempAccessToken = require('../../models/tempAccessToken');

module.exports = function (passport) {
    passport.use('temp-access-token',
        new JwtStrategy({
            secretOrKey: config.get('token:tempAccessSecret'),
            passReqToCallback: true
        }, function (req, payload, done) {
            TempAccessToken.findOneAndUpdate(
                {_id: payload.userId},
                {
                    $setOnInsert: {_id: payload.userId},
                    $push: {
                        expired: {
                            $each: [payload.exp],
                            $sort: -1,
                            $slice: 1
                        }
                    }
                },
                {
                    new: false,
                    upsert: true
                },
                function (err, tempAccessToken) {
                    if (err) {
                        return done(err);
                    }

                    // When create document
                    if(!tempAccessToken){
                        tempAccessToken=new TempAccessToken({
                            _id: payload.userId,
                            expired: [0]
                        });
                    }

                    req.payload = payload;
                    done(null, tempAccessToken);
                });
        }));
};
