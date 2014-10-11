/*global angular */

var app = angular.module("app");

app.filter("translate", ["locale",
    function(locale) {
        return function(label) {
            if (label in locale) {
                return locale[label];
            } else {
                return label;
            }
        };
    }
]);