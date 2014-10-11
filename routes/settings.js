var db = require('../models');
var lodash = require('lodash');

exports.getCameras = function(req, res) {
    db.Camera.findAll({
        order: ['order']
    }).then(function(results) {
       res.send(lodash.map(results, function(element, index, list) {
            return lodash.pick(element.toJSON(), ['id', 'name']);
        }));
    });
};

exports.getCamera = function(req, res) {
    db.Camera.find(parseInt(req.params.id, 10))
        .then(function(result) {
            res.send(result);
        });
};

exports.createCamera = function(req, res, next) {
    db.sequelize.transaction().then(function(t) {
        db.Camera.max('order', {
            transaction: t
        }).then(function(order) {
            var camera = req.body;
            camera.order = (order || 0) + 1;

            return db.Camera.create(camera, {
                transaction: t
            });
        }).then(function() {
            return t.commit();
        }).then(function() {
            res.status(201).send();
        }, function(err) {
            t.rollback();
            next(err);
        });
    });
};

exports.updateCamera = function(req, res) {
    db.Camera.find(req.params.id)
        .then(function(result) {
            return result.updateAttributes(req.body);
        }).then(function() {
            res.status(204).send();
        });
};

exports.deleteCamera = function(req, res, next) {
    var cameraOrder;
    
    db.sequelize.transaction().then(function(t) {
        db.Camera.find(req.params.id, {
            transaction: t
        }).then(function(camera) {
            cameraOrder = camera.order;
            
            return camera.destroy({
                transaction: t
            });
        }).then(function() {
            return db.sequelize.query('UPDATE "Cameras" SET "order" = ("order" - 1) WHERE "order" > :order', null, {
                transaction: t
            }, {
                order: cameraOrder
            });
        }).then(function() {
            return t.commit();
        }).then(function() {
            res.status(204).send();
        }, function(err) {
            t.rollback();
            next(err);
        });
    });
};

exports.moveUpCamera = function(req, res, next) {
    var camera;

    db.sequelize.transaction().then(function(t) {
        db.Camera.find(req.params.id, {
            transaction: t
        }).then(function(c) {
            camera = c;

            return db.Camera.find({
                where: {
                    order: {
                        lt: camera.order
                    }
                },
                order: [
                    ['order', 'DESC']
                ],
                transaction: t
            });
        }).then(function(prevCamera) {
            return [
                camera.decrement('order', {
                    transaction: t
                }),
                prevCamera.increment('order', {
                    transaction: t
                })
            ];
        }).then(function() {
            return t.commit();
        }).then(function() {
            res.status(204).send();
        }, function(err) {
            t.rollback();
            next(err);
        });
    });
};

exports.moveDownCamera = function(req, res, next) {
    var camera;

    db.sequelize.transaction().then(function(t) {
        db.Camera.find(req.params.id, {
            transaction: t
        }).then(function(c) {
            camera = c;

            return db.Camera.find({
                where: {
                    order: {
                        gt: camera.order
                    }
                },
                order: ['order'],
                transaction: t
            });
        }).then(function(nextCamera) {
            return [
                camera.increment('order', {
                    transaction: t
                }),
                nextCamera.decrement('order', {
                    transaction: t
                })
            ];
        }).then(function() {
            return t.commit();
        }).then(function() {
            res.status(204).send();
        }, function(err) {
            t.rollback();
            next(err);
        });
    });
};