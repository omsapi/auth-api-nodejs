var express = require('express');

var router = express.Router();

module.exports = function () {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    return router;
};