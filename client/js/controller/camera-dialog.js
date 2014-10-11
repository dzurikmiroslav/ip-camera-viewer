/* global angular */

var app = angular.module('app');

app.controller('CameraDialogController', function($scope, $modalInstance, request, cameraId) {
    if (cameraId) {
        request.get('/settings/cameras/:id', {
            id: cameraId
        }).then(function(camera) {
            $scope.camera = camera;
        });
    } else {
        $scope.camera = {};
    }

    $scope.add = function() {
        request.post('/settings/cameras', $scope.camera).then(function() {
            $modalInstance.close();
        });
    };

    $scope.save = function() {
        request.put('/settings/cameras/:id', $scope.camera).then(function() {
            $modalInstance.close();
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
});