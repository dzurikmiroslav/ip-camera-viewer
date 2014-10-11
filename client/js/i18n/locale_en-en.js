/* global angular */

angular.module('appLocale', [], ['$provide',
    function($provide) {
        $provide.value('locale', {
            //errors
            UKNOW_ERROR: 'Uknow error',
            INVALID_LOGIN: 'Invalid login',
            UNAUTHORIZED: 'You are not logged in, come back to login screen',
            RECORD_NOT_EXITS: 'Record not exists',
            //stuff
            PLEASE_LOGIN: 'Please login',
            LOGIN: 'Login',
            USERNAME: 'Username',
            PASSWORD: 'Password',
            ERROR: 'Error',
            OK: 'Ok'
        });
    }
]);