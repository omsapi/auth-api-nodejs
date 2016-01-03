var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('omsapi-config');
var routes = require('./routes/index');

var options = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    }
};
console.log(config.get('mongodb:connection'));
mongoose.connect(config.get('mongodb:connection'), options);

var app = express();

// Configure CORS
app.use(require('cors')({allowedHeaders: 'Authorization, Content-Type', origin: true, credentials: true}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (res.statusCode === 500) {
            console.log(require('moment').utc().toString());
            console.log(err.message);
            console.log(err.stack);
        }
        res.send({
            message: err.message,
            error: {}
        });
    });
} else {
// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
