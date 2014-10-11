/* global angular */

var app = angular.module('app');

app.controller('ErrorDialogController', function($scope, $modalInstance, error) {
    $scope.error = error;

    $scope.cancel = function() {
        $modalInstance.dismiss('canceled');
    };
});