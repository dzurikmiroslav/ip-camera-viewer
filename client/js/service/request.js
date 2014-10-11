/* global angular */

var app = angular.module('app');

app.factory('request', function($http, $q) {
    function request(config) {
        config.url = interpolateUrl(config.url, config.params, config.data);

        var deferred = $q.defer();

        $http(config)
            .success(function(data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config) {
                deferred.reject(status);
            });

        return deferred.promise;
    }

    function interpolateUrl(url, params, data) {
        params = params || {};
        data = data || {};

        url = url.replace(/(\(\s*|\s*\)|\s*\|\s*)/g, "");
        url = url.replace(/:([a-z]\w*)/gi, function($0, label) {
            return (popFirstKey(data, params, label) || "");
        });
        url = url.replace(/(^|[^:])[\/]{2,}/g, "$1/");
        url = url.replace(/\/+$/i, "");

        return url;
    }

    function popFirstKey(object1, object2, objectN) {
        var objects = Array.prototype.slice.call(arguments);

        var key = objects.pop();
        var object = null;

        while ((object = objects.shift())) {
            if (object.hasOwnProperty(key)) {
                return popKey(object, key);
            }
        }
    }

    function popKey(object, key) {
        var value = object[key];
        delete(object[key]);
        return value;
    }

    function createMethods(names) {
        angular.forEach(names, function(method) {
            request[method] = function(url, data, config) {
                return request(angular.extend(config || {}, {
                    method: (method),
                    url: url,
                    data: data
                }));
            };
        });
    }

    createMethods(['post', 'get', 'delete', 'put']);

    return request;
});