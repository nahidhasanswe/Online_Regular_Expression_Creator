/// <reference path="angular.js" />

'use strict';

var AuthApp = angular.module('AuthApp', ['LocalStorageModule']);

// Global Variable for base path
AuthApp.constant('serviceBasePath', 'http://localhost:52285');

AuthApp.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {

    var authInterceptorServiceFactory = {};

    authInterceptorServiceFactory.request = function (config) {

        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    }

    authInterceptorServiceFactory.responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('authService');
            var authData = localStorageService.get('authorizationData');
            authService.logOut();
            $location.path('/login');
        }
        
        return $q.reject(rejection);
    };

    return authInterceptorServiceFactory;

}]);


AuthApp.factory('authService', ['$http', '$q', 'localStorageService', 'serviceBasePath', function ($http, $q, localStorageService, serviceBasePath) {
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    authServiceFactory.saveRegistration = function (registration) {

        authServiceFactory.logOut();

        return $http.post(serviceBasePath + '/api/account/register', registration)
    };

    authServiceFactory.login = function (loginData) {
    
        var obj = { 'username': loginData.userName, 'password': loginData.password, 'grant_type': 'password' };

        Object.toparams = function ObjectsToParams(obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        } 

        var deferred = $q.defer();

        $http({
            method: 'post',
            url: serviceBasePath + "/token",
            data: Object.toparams(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            var storage = {
                token: response.data.access_token,
                userName: loginData.userName,
                Name: response.data.Name,
                Image: response.data.Image,
                isConfirm: response.data.EmailConfirm
            }
            
            localStorageService.set('authorizationData', storage, 'localStorage');
            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;

            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error.data);
        })
        return deferred.promise;
    }

    authServiceFactory.logOut = function () {

        localStorageService.remove('authorizationData');
    };

    authServiceFactory.changePassword = function (passwordData) {

            return $http.post(serviceBasePath+'/api/Manage/ChangePassword', passwordData)
    };

    authServiceFactory.ConfirmEmail = function (data) {
        var config = {
            params: {
                code: data.code,
                userId: data.userId
            }
        }
        return $http.get(serviceBasePath + '/api/account/ConfirmEmail',config);
        
    };

    authServiceFactory.ResetPassword = function (data) {
        return $http.post(serviceBasePath + '/api/account/ResetPassword', data);
    }

    authServiceFactory.ForgotPassword = function (data) {
        return $http.post(serviceBasePath + '/api/account/ForgotPassword', data);
    }

    authServiceFactory.ResendConfirmMail = function (data) {
        return $http.post(serviceBasePath + '/api/account/ResendConfirmMail', data);
    }

    authServiceFactory.getAuthData = function () {

        var auth = localStorageService.get('authorizationData');
        return auth;
    };

    return authServiceFactory;
}]);