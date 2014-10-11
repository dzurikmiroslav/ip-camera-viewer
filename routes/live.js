var db = require('../models');
var lodash = require('lodash');
var spawn = require('child_process').spawn;

exports.getCameras = function(req, res) {
    db.Camera.findAll({
        order: ['order']
    }).then(function(results) {
        res.send(lodash.map(results, function(element, index, list) {
            return lodash.pick(element.toJSON(), ['id', 'name']);
        }));
    });
};

function getCameraPreview(format, codec, req, res, next) {
    db.Camera.find(parseInt(req.params.id, 10))
        .then(function(camera) {
            var options = camera.options.split(' ').map(function(opt) {
                return opt.trim();
            });

            res.writeHead(200, {
                'Connection': 'keep-alive',
                'Content-Type': 'video/' + format,
                'Accept-Ranges': 'bytes'
            });

            options.push('-i', camera.url, '-vcodec', codec, '-an', '-f', format, '-video_size', '320x240',
                '-movflags', 'frag_keyframe+empty_moov', '-reset_timestamps', '1', '-vsync', '1',
                '-flags', 'global_header', '-bsf:v', 'dump_extra', '-y', '-');

            //or avconv
            var proc = spawn('ffmpeg', options, {
                detached: false
            });
            proc.stdout.pipe(res);

            proc.on('error', function(e) {
                console.log('FFMPEG system error: ' + e);
            });

            var killProc = function() {
                if (proc) {
                    proc.kill();
                    proc = null;
                }
            };
            req.on('end', killProc);  //TODO not run yet
            req.on('close', killProc);
        }, next);
}

exports.getCameraPreviewMp4 = lodash.bind(getCameraPreview, null, 'mp4', 'libx264');

exports.getCameraPreviewWebm = lodash.bind(getCameraPreview, null, 'webm', 'libvpx');

exports.getCameraPreviewOgg = lodash.bind(getCameraPreview, null, 'ogg', 'libtheora');
