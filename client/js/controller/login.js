/* global angular */

var app = angular.module('app');

app.controller('LoginController', function($scope, $rootScope, request) {
    $scope.username = ''
    $scope.password = '';

    $scope.login = function() {
        request.post('/auth/login', {
            username: $scope.username,
            password: $scope.password
        }).then(function(principal) {
            $rootScope.principal = principal;
        });
    };
});