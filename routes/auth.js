var crypto = require('crypto');
var db = require('../models');

var hashPassword = exports.hashPassword = function(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
};

exports.check = function(req, res, next) {
    if (!req.session.user) {
        res.status(401).send({
            code: 'UNAUTHORIZED'
        });
    } else {
        next();
    }
}

exports.login = function(req, res, next) {
    db.User.find({
        where: {
            username: req.body.username,
            password: hashPassword(req.body.password)
        }
    }).then(function(user) {
        if (user) {
            req.session.regenerate(function() {
                req.session.user = {
                    username: user.username,
                    isAdmin: user.isAdmin
                }
                res.json(req.session.user);
            });
        } else {
            next('INVALID_LOGIN');
        }
    });
};

exports.logout = function(req, res, next) {
    req.session.destroy(function() {
        res.status(204).send();
    });
};

exports.getUser = function(req, res) {
    if (req.session && req.session.user) {
        res.send(req.session.user);
    } else {
        res.status(204).send();
    }
};