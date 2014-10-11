var express = require('express');
var auth = require('./auth');
var settings = require('./settings');
var live = require('./live');

var router = express.Router();

router.post('/auth/login', auth.login);
router.post('/auth/logout', auth.logout);
router.get('/auth/user', auth.getUser);

router.get('/settings/cameras', auth.check, settings.getCameras);
router.get('/settings/cameras/:id', auth.check, settings.getCamera);
router.put('/settings/cameras/:id', auth.check, settings.updateCamera);
router.post('/settings/cameras', auth.check, settings.createCamera);
router.delete('/settings/cameras/:id', auth.check, settings.deleteCamera);
router.put('/settings/cameras/:id/move_up', auth.check, settings.moveUpCamera);
router.put('/settings/cameras/:id/move_down', auth.check, settings.moveDownCamera);

router.get('/live/cameras', auth.check, live.getCameras);
router.get('/live/cameras/:id/preview.mp4', auth.check, live.getCameraPreviewMp4);
router.get('/live/cameras/:id/preview.webm', auth.check, live.getCameraPreviewWebm);
router.get('/live/cameras/:id/preview.ogg', auth.check, live.getCameraPreviewOgg);

module.exports = router;