/* global angular */

var app = angular.module('app');

app.controller('SettingsController', function($scope, $modal, request) {
    function loadCameras() {
        request.get('/settings/cameras').then(function(cameras) {
            $scope.cameras = cameras;
        });
    }

    loadCameras();

    $scope.edit = function(id) {
        $modal.open({
            templateUrl: 'template/camera-dialog.html',
            controller: 'CameraDialogController',
            resolve: {
                cameraId: function() {
                    return id;
                }
            }
        }).result.then(loadCameras);
    };

    $scope.delete = function(id) {
        request.delete('/settings/cameras/:id', {
            id: id
        }).then(loadCameras);
    };

    $scope.moveUp = function(id) {
        request.put('/settings/cameras/:id/move_up', {
            id: id
        }).then(loadCameras);
    };
    
    $scope.moveDown = function(id) {
        request.put('/settings/cameras/:id/move_down', {
            id: id
        }).then(loadCameras);
    };
});
