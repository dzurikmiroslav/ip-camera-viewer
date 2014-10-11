/* global angular */

var app = angular.module('app');

app.controller('LiveController', function($scope, request) {
    request.get('/live/cameras').then(function(cameras) {
        $scope.cameras = cameras;
    });
});