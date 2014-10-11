/* global angular */

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'appLocale']);

app.config(function($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
        .when('/', {
            templateUrl: 'template/live-view.html',
            controller: 'LiveController'
        })
        .when('/archive', {
            templateUrl: 'template/archive-view.html'
        })
        .when('/events', {
            templateUrl: 'template/events-view.html'
        })
        .when('/settings', {
            templateUrl: 'template/settings-view.html',
            controller: 'SettingsController'
        })
        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push(function($q, $injector) {
        return {
            responseError: function(rejection) {
                $injector.invoke(function($modal) {
                    $modal.open({
                        templateUrl: 'template/error-dialog.html',
                        controller: 'ErrorDialogController',
                        resolve: {
                            error: function() {
                                return rejection.data;
                            }
                        }
                    });
                });
                return $q.reject(rejection);
            }
        };
    });
});


app.run(function($rootScope, request) {
    $rootScope.principal = null;

    request.get('/auth/user').then(function(principal) {
        console.log(typeof principal);
        console.log(principal);
        if (principal !== 'null') {
            $rootScope.principal = principal;
        }
    });
})