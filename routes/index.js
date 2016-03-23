var express = require('express');
var accessToken = require('../middleware/access-token-mw');
var refreshToken = require('../middleware/refresh-token-mw');
var refreshJwt=require('../middleware/refresh-jwt-mw');
var tempAccessToken=require('../middleware/temp-access-token-mw');

var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.post('/create', [
        passport.authenticate('temp-access-token', {session: false, assignProperty: 'tempAccessToken'}),
        tempAccessToken.check,
        refreshToken.createNew,
        refreshJwt.create,
        accessToken.create
    ], function (req, res, next) {
        res.status(201);
        sendTokens(res);
    });

    router.get('/refresh', [
        passport.authenticate('refresh-update', {session: false, assignProperty: 'refreshToken'}),
        refreshJwt.create,
        accessToken.create
    ], function (req, res, next) {
        sendTokens(res);
    });

    router.delete('/', [
        passport.authenticate('refresh-remove', {session: false, assignProperty: 'refreshToken'}),
    ], function (req, res, next) {
        res.send();
    });

    router.delete('/all', [
        passport.authenticate('refresh-remove-all', {session: false, assignProperty: 'refreshToken'}),
    ], function (req, res, next) {
        res.send();
    });

    return router;
};

function sendTokens(res) {
    res.send({
        accessJwt: res.locals.accessJwt,
        refreshJwt: res.locals.refreshJwt
    });
}