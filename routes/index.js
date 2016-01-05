var express = require('express');
var accessToken = require('../middleware/access-token-mw');
var refreshToken = require('../middleware/refresh-token-mw');

var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.post('/create', [
        passport.authenticate('temp-access-token', {session: false, assignProperty: 'refreshToken'}),
        refreshToken.create,
        accessToken.create
    ], function (req, res, next) {
        req.refreshToken.save(function (err) {
            if (err) {
                return next(err);
            }

            res.status(201);
            sendTokens(res);
        });
    });

    router.get('/refresh', [
        passport.authenticate('refresh-token', {session: false, assignProperty: 'refreshToken'}),
        refreshToken.remove,
        refreshToken.create,
        accessToken.create
    ], function (req, res, next) {
        req.refreshToken.save(function (err) {
            if (err) {
                return next(err);
            }

            sendTokens(res);
        });
    });

    router.delete('/', [
        passport.authenticate('refresh-token', {session: false, assignProperty: 'refreshToken'}),
        refreshToken.remove
    ], function (req, res, next) {
        req.refreshToken.save(function (err) {
            if (err) {
                return next(err);
            }

            res.send();
        });
    });

    router.delete('/all', [
        passport.authenticate('refresh-token', {session: false, assignProperty: 'refreshToken'}),
        refreshToken.removeAll
    ], function (req, res, next) {
        req.refreshToken.save(function (err) {
            if (err) {
                return next(err);
            }

            res.send();
        });
    });

    return router;
};

function sendTokens(res) {
    res.send({
        accessJwt: res.locals.accessJwt,
        refreshJwt: res.locals.refreshJwt
    });
}