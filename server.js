/* Configuration */

process.env.PORT = process.env.PORT || 3000;
process.env.IP = process.env.IP || "0.0.0.0";
process.env.DEFAUL_USERNAME = process.env.DEFAUL_USERNAME || "admin";
process.env.DEFAUL_PASSWORD = process.env.DEFAUL_PASSWORD || "admin";

/* End of configuration */

var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require('./routes');
var db = require('./models');
var auth = require('./routes/auth');

var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'YOLOOOTROLOOO',
    saveUninitialized: true,
    resave: true
}));
app.use(express.static(path.resolve(__dirname, 'client')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    console.log('HTTP request "%s" params=%j body=%j', req.url, req.params, req.body);
    next();
})
app.use(routes);
app.use(function(err, req, res, next) {
    console.error('Woo such error handling');
    console.error(err);
    res.status(500);
    if (err instanceof Error) {
        res.send({
            code: 'UKNOW_ERROR',
            name: err.name,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.send({
            code: typeof err === 'string' ? err : 'UKNOW_ERROR'
        });
    }
});

db.sequelize.sync({
    force: false
}).complete(function(err) {
    if (err) {
        throw err[0];
    } else {
        //create default user if not exit
        db.User.count().then(function(c) {
            if (c === 0) {
                db.User.create({
                    username: process.env.DEFAUL_USERNAME,
                    password: auth.hashPassword(process.env.DEFAUL_PASSWORD),
                    isAdmin: true
                });
            }
        });

        app.listen(process.env.PORT, process.env.IP, function() {
            console.log("App listening at", process.env.IP + ":" + process.env.PORT);
        });
    }
});