var myApp = angular.module('myApp', ['ngRoute', 'LocalStorageModule', 'AuthApp', 'ui.bootstrap', 'ngMessages', 'ngPassword']);

myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
})

//ng routing
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        redirectTo: '/home'
    })
    .when('/home', {
        templateUrl: '/View/home.html',
        controller: 'homeController'
    })
    .when('/login', {
        templateUrl: '/View/modal.html',
        controller: 'login2Controller'
    })
    .when('/authorized', {
        templateUrl: '/View/authorize.html',
        controller: 'authorizeController'
    })
    .when('/unauthorized', {
        templateUrl: '/View/unauthorize.html',
        controller: 'unauthorizeController'
    })
}])


//global veriable for store service base path
myApp.constant('serviceBasePath', 'http://localhost:52285');
//controllers

myApp.controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {
    //FETCH DATA FROM SERVICES
    $scope.result ='';
    dataService.GetAnonymousData().then(function (data) {
        $scope.result = data;
    })
}])
myApp.controller('autheticateUser', ['$scope', 'userService', function ($scope, userService) {
    //FETCH DATA FROM SERVICES
    $scope.account = {
        username: '',
        password: ''
    }
    $scope.account = userService.GetCurrentUser();
}])
myApp.controller('authorizeController', ['$scope', 'dataService', function ($scope, dataService) {
    //FETCH DATA FROM SERVICES
    $scope.data = "";
    dataService.GetAuthorizeData().then(function (data) {
        $scope.data = data;
    })
}])
myApp.controller('loginController', ['$scope', 'authService', 'errorService', '$location', '$window', function ($scope, authService,errorService, $location, $window, $modalInstance) {
    //FETCH DATA FROM SERVICES
    $scope.init = function () {
        $scope.isProcessing = false;
        $scope.LoginBtnText = "Sign In";
        $scope.buttonText = "Create Account";
    }

    $scope.message = '';
    $scope.regMessage = '';
    $scope.init();
    $scope.loginData = {
        userName: "",
        password: ""
    }

    $scope.account = {
        Email: '',
        Password: '',
        ConfirmPassword: ''
    };

    $scope.Login = function (data) {
        $scope.isProcessing = true;
        $scope.LoginBtnText = "Signing in.....";

        if (!data) {
            authService.login($scope.loginData).then(function (response) {
                $scope.$dismiss();
                $window.location.reload();
                $location.path('/home');
            }, function (error) {
                $scope.message = error.error_description;
                $scope.init();
            })
        } else {
            $scope.init();
        }
    }

    $scope.Registration = function (data) {
        $scope.isProcessing = true;
        $scope.buttonText = "Creating.....";
        
        if (!data) {
            authService.saveRegistration($scope.account).then(function (response) {
                $scope.$dismiss();
                loginAfterRegister($scope.account);
            }, function (error) {
                $scope.regMessage = errorService.geApiError(error.data);
                console.log(errorService.geApiError(error.data));
                $scope.init();
            })
        } else {
            $scope.init();
        }
    }

    loginAfterRegister = function (account) {
        var login = {
            userName: account.Email,
            password:account.Password
        }
        
        authService.login(login).then(function (response) {
            $window.location.reload();
            $location.path('/home');
        }, function (error) {
            console.log(error.error_description);
        })
    }

    $scope.close = function () {
        $scope.$dismiss();
    }

}])
myApp.controller('login2Controller', ['$scope', 'authService', 'errorService', '$location', '$window', 'localStorageService', function ($scope, authService, errorService, $location, $window, localStorageService) {

    // Check that User already login and redirect to home page
    var authData = localStorageService.get('authorizationData');
    if (authData) {
        $location.path('/home');
    }

    $scope.init = function () {
        $scope.isProcessing = false;
        $scope.LoginBtnText = "Sign In";
        $scope.buttonText = "Create Account";
    }

    $scope.message = '';
    $scope.regMessage = '';
    $scope.init();
    $scope.loginData = {
        userName: "",
        password: ""
    }

    $scope.account = {
        Email: '',
        Password: '',
        ConfirmPassword: ''
    };
    

    $scope.Login = function (data) {
        $scope.isProcessing = true;
        $scope.LoginBtnText = "Signing in.....";

        if (!data) {
            authService.login($scope.loginData).then(function (response) {
                $window.location.reload();
                $location.path('/home');
            }, function (error) {
                $scope.message = error.error_description;
                $scope.init();
            })
        } else {
            $scope.init();
        }
    }

    $scope.Registration = function (data) {
        $scope.isProcessing = true;
        $scope.buttonText = "Creating.....";

        if (!data) {
            authService.saveRegistration($scope.account).then(function (response) {
                loginAfterRegister($scope.account);
            }, function (error) {
                $scope.regMessage = errorService.geApiError(error.data);
                console.log(errorService.geApiError(error.data));
                $scope.init();
            })
        } else {
            $scope.init();
        }
    }

    loginAfterRegister = function (account) {
        var login = {
            userName: account.Email,
            password: account.Password
        }

        authService.login(login).then(function (response) {
            $window.location.reload();
            $location.path('/home');
        }, function (error) {
            console.log(error.error_description);
        })
    }

}])
myApp.controller('usernameController', ['$scope','$rootScope', 'authService', '$q', 'localStorageService', '$location', '$window', '$uibModal', function ($scope,$rootScope, authService, $q, localStorageService, $location, $window, $uibModal) {
    var authData = localStorageService.get('authorizationData');
    if (authData)
        $scope.account = authData.userName;
    else
        $scope.account = null;

    //This method for open login model with loginController
    $scope.login = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/View/login.html',
            controller: 'loginController',
            scope: $scope,
            size:'sm'
        });
        modalInstance.result.then(
            function (result) {
                alert(result);
            },
            function (result) {
                
            }
        );
    }
    //This method for opening Regitration form
    $scope.register = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/View/registration.html',
            controller: 'loginController',
            scope: $scope,
            size: 'sm'
        });
        modalInstance.result.then(
            function (result) {
                alert(result);
            },
            function (result) {

            }
        );
    }
    //This method is logout feature
    $scope.logout = function () {
        authService.logOut();
        $window.location.reload();
        $location.path('/home');
    }

}])


//services
myApp.factory('dataService', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};
    fac.GetAnonymousData = function () {
        return $http.get(serviceBasePath + '/api/Product').then(function (response) {
            return response.data;
        })
    }

    fac.GetAuthorizeData = function () {
        return $http.get(serviceBasePath + '/api/Account/getUsername').then(function (response) {
            return response.data;
        })
    }



    return fac;
}])
myApp.factory('userService', function () {
    var fac = {};
    fac.CurrentUser = null;
    fac.SetCurrentUser = function (user) {
        fac.CurrentUser = user;
        sessionStorage.user = angular.toJson(user);
    }
    fac.GetCurrentUser = function () {
        fac.CurrentUser = angular.fromJson(sessionStorage.user);
        return fac.CurrentUser;
    }
    return fac;
})
myApp.factory('errorService', function () {
    var fac = {};
    fac.geApiError = function (errorResponse) {
        var errors = [];
        for (var key in errorResponse.ModelState) {
            for (var i = 0; i < errorResponse.ModelState[key].length; i++) {
                errors.push(errorResponse.ModelState[key][i]);
            }
        }
        return errors;
    }
    return fac;
})
myApp.factory('accountService', ['$http', '$q', 'serviceBasePath', 'getUserService', 'userService', function ($http, $q, serviceBasePath, getUserService, userService) {
    var fac = {};
    fac.login = function (user) {
        var obj = { 'username': user.username, 'password': user.password, 'grant_type': 'password' };
        Object.toparams = function ObjectsToParams(obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        }

        var defer = $q.defer();

        $http({
            method: 'post',
            url: serviceBasePath + "/token",
            data: Object.toparams(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            userService.SetCurrentUser(response.data);
            getUserService.setUsername(user);
            defer.resolve(response.data);
        }, function (error) {
            defer.reject(error.data);
        })
        return defer.promise;
    }
    fac.logout = function () {
        userService.CurrentUser = null;
        userService.SetCurrentUser(userService.CurrentUser);
    }
    return fac;
}])
