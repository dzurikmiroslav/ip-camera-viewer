/* global angular */

var app = angular.module("app");

app.controller('AppController', function($scope, $rootScope, $location, request) {
    $scope.menuItems = [{
        url: '#',
        name: 'Live'
    }, {
        url: '#archive',
        name: 'Archive'
    }, {
        url: '#events',
        name: 'Events'
    }, {
        url: '#settings',
        name: 'Settings'
    }];

    $scope.isActive = function(menuItem) {
        return menuItem.url.substr(1) === $location.path().substr(1);
    };

    $scope.logout = function() {
        request.post('/auth/logout').then(function() {
            $rootScope.principal = null;
        });
    };
});