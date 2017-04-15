var myApp = angular.module('myApp', ['ngRoute', 'LocalStorageModule', 'angularUtils.directives.dirPagination', 'AuthApp', 'ui.bootstrap', 'ngMessages', 'ngPassword']);

myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
})

//ng routing
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.caseInsensitiveMatch = true;

    $routeProvider
    .when('/', {
        redirectTo: '/home'
    })
    .when('/home', {
        templateUrl: '/View/home.html',
        controller: 'homeController'
    })
    .when('/login', {
        templateUrl: '/View/Authentication/modal.html',
        controller: 'login2Controller'
    })
    .when('/ConfirmEmail', {
        templateUrl: '/View/Account/EmailConfirm.html',
        controller: 'emailConfirmController'
    })
    .when('/ResetPassword', {
        templateUrl: '/View/Account/ResetPassword.html',
        controller:'resetPasswordController'
    })
    .when('/ForgotPassword', {
        templateUrl: '/View/Account/ForgotPassword.html',
        controller: 'forgotPasswordController'
    })
    .when('/ChangePassword', {
        templateUrl: '/View/Account/ChangePassword.html',
        controller: 'changePasswordController'
    })
    .when('/CreateRegExp', {
        templateUrl: '/View/Regexp/CreateRegExp.html',
        controller: 'createRegexpController'
    })
    .when('/MyStore', {
        templateUrl: '/View/Regexp/MyStore.html',
        controller: 'storeController'
    })
    .when('/UpdateRegexp', {
        templateUrl: '/View/Regexp/UpdateRegularExp.html',
        controller: 'updateController'
    })
    .otherwise({
        redirectTo:'/'
    })
}])
//Directive for page Loader show



//global veriable for store service base path
myApp.constant('serviceBasePath', 'http://localhost:52285');
//controllers

myApp.controller('homeController', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
    $scope.init = function () {
        $scope.testBtn = 'Test';
        $scope.isProcessing = false;
    }
    $scope.init();

    $scope.RegTest = {
        Exp: '',
        text:''
    }

    $scope.QueryString = function () {
        var regexp = $routeParams.RegExp;
        if(regexp!=null)
        {
            $scope.RegTest.Exp = regexp;
        }
    }


    $scope.Testing = function (data) {
        $scope.testBtn = 'Testing....';
        $scope.isProcessing = true;
        var obj = $scope.RegTest;
        if (!data) {
            if (obj.text.match(obj.Exp)) {
                swal({
                    title: 'Match!',
                    text: 'The Regular Expression is match with the text',
                    type: 'success'
                })
                $scope.init();
            } else {
                swal({
                    title: 'Sorry!',
                    text: 'The text is not match with Regular Expression',
                    type: 'warning'
                })
                $scope.init();
            }
        } else
            $scope.init();
    }
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
        Name:'',
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

    $scope.forgotPassowrd = function () {
        $scope.$dismiss();
        $window.location.href = '#/forgotPassword';
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

    $scope.forgotPassowrd = function () {
        $scope.$dismiss();
        $window.location.href = '#/forgotPassword';
    }

}])
myApp.controller('usernameController', ['$scope', 'errorService', 'authService', '$q', 'localStorageService', '$location', '$window', '$uibModal', function ($scope, errorService, authService, $q, localStorageService, $location, $window, $uibModal) {
    var authData = localStorageService.get('authorizationData');
    if (authData){
        $scope.account = authData.userName;
        $scope.isLogin = true;
        $scope.Name = authData.Name;
        $scope.Image = authData.Image;
        if (authData.isConfirm=="False")
            $scope.isConfirm = true;
        else
            $scope.isConfirm = false;
    }    
    else
        $scope.isLogin = false;

    $scope.resendConfirmMail = function () {
        var model = {
            Email:authData.userName
        }
        swal({
            title: 'Resend Confirmation Mail',
            text: 'Are you sure to sent confirmation mail?',
            type: 'warning',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            confirmButtonText: 'Send Mail',
            cancelButtonText: 'Cancel',
            closeOnConfirm:false
        }, function () {
            authService.ResendConfirmMail(model).then(function () {
                swal('Successful!','A confirmation mail is sent to your mail','success');
            }, function (error) {
                var err = errorService.geApiError(error.data);
                swal('Error!',err, 'error');
            });
        });
    }


    //This method for open login model with loginController
    $scope.login = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/View/Authentication/login.html',
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
            templateUrl: '/View/Authentication/registration.html',
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

}]);
myApp.controller('emailConfirmController', ['$scope', 'authService', '$routeParams', 'errorService', '$location', 'localStorageService', '$window', function ($scope, authService, $routeParams, errorService, $location, localStorageService, $window) {
    var confirmEmailModel = {
        userId: $routeParams.userId,
        code:$routeParams.code
    }

    if (confirmEmailModel.userId == null || confirmEmailModel.code == null) {
        swal({
            title: 'Error!',
            text: 'User Id or code is empty',
            type: 'error',
            closeOnConfirm:false
        }, function () {
            $window.location.href('#/home');
        })
    }

    authService.ConfirmEmail(confirmEmailModel).then(function (response) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            authData.isConfirm = "True";
            localStorageService.remove('authorizationData');
            localStorageService.set('authorizationData', authData, 'localStorage');
        }
        swal({
            title: 'Success',
            text: 'Your Email is Verified',
            type: 'success',
            showConfirmButton: true,
            closeOnConfirm: false
        }, function () {
            $window.location.reload();
            $window.location.href = '#/home';
            swal.close();

        })
    }, function (error) {
        var err = errorService.geApiError(error.data);
        swal({
            title: 'Error',
            text: err,
            type: 'error',
            showConfirmButton: true,
            closeOnConfirm: false
        }, function () {
            $window.location.href = '#/home';
            swal.close();
        })
    });
}]);
myApp.controller('resetPasswordController', ['$scope', 'authService', '$routeParams', 'errorService', '$location', '$window', function ($scope, authService, $routeParams, errorService, $location, $window) {

    authService.logOut();

    $scope.resetPasswordModel = {
        id:$routeParams.id,
        code: $routeParams.code,
        NewPassword: '',
        ConfirmPassword:''
    }
    $scope.init =function() {
        $scope.isProcessing = false;
        $scope.resetBtn = "Reset";
    }
    $scope.init();

    $scope.Reseting = function (data) {
        $scope.isProcessing = true;
        $scope.resetBtn = "Resetting";
        if (!data) {
            authService.ResetPassword($scope.resetPasswordModel).then(function (response) {
                swal({
                    title: 'Congratulation!',
                    text: 'New password set successfully.Click Ok to login page or click cancel',
                    type: 'success',
                    showCancelButton: true,
                    showConfirmButton: true,
                    closeOnConfirm: false
                }, function () {
                    $window.location.href = '#/login';
                    swal.close();
                });
            }, function (error) {
                $scope.errors = errorService.geApiError(error.data);
                $scope.init();
            })
        } else
            $scope.init();
    }

}]);
myApp.controller('forgotPasswordController', ['$scope', 'authService', 'errorService', '$window', function ($scope, authService, errorService, $window) {
    
    $scope.init=function()
    {
        $scope.isProcessing = false;
        $scope.resendBtn = 'Resend Email';
    }
    $scope.init();

    $scope.forgotPasswordEmail = {
        Email:''
    };

    $scope.Resending= function (data)
    {
        $scope.isProcessing = true;
        $scope.resendBtn = 'Resending....';
        if (!data) {
            authService.ForgotPassword($scope.forgotPasswordEmail).then(function (response) {
                $scope.init();
                swal({
                    title: 'Success!',
                    text: 'We send new mail for resetting password.Please check your mail',
                    type: 'success',
                    closeOnConfirm: false
                },
                    function () {
                        $window.location.href = '#/home';
                       // $window.location.reload();
                        swal.close();
                    }
                );
            },function (error) {
                $scope.errors = errorService.geApiError(error.data);
                $scope.init();
                swal({
                    title: 'Error!',
                    text:$scope.errors,
                    type: 'error',
                    closeOnConfirm: false
                }, function () {
                    $scope.errors = '';
                    swal.close();
                })
            });
        } else
            $scope.init();
    }
}]);
myApp.controller('changePasswordController', ['$scope', 'authService', 'errorService', '$window', 'localStorageService', function ($scope, authService, errorService, $window, localStorageService) {

    var authData = localStorageService.get('authorizationData');
    if (!authData) {
        $window.location.href = '#/login';
    }
}]);
myApp.controller('createRegexpController', ['$scope', 'localStorageService', '$window', '$uibModal', 'jsonServices', 'RegDataServices', '$location', function ($scope, localStorageService, $window, $uibModal, jsonServices, RegDataServices, $location) {
    
    $location.search({});

    var authData = localStorageService.get('authorizationData');
    if (!authData) {
        $window.location.href = '#/login';
    }

    $scope.RegList = [];

    $scope.AddRequirement = function (data) {
        $scope.list.push(data);
        $scope.RegList = $scope.list;
        $scope.$dismiss();
    }

    $scope.OpenModal = function () {
        $scope.list = $scope.RegList;
        jsonServices.getRegObject().then(function (response) { $scope.Section = response.data });
        var modalInstance = $uibModal.open({
            templateUrl: '/View/Regexp/AddReg.html',
            controller: 'createRegexpController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.Remove = function (index) {
        swal({
            title: 'Warning!',
            text: 'Are you sure to remove this requirement?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
        }).then(function () {
            $scope.$applyAsync(function () {
                $scope.RegList.splice(index, 1);
            });
            swal.close();
        });
    }

    $scope.Update = function (index) {
        $scope.list = $scope.RegList;
        $scope.Section = angular.copy($scope.list[index]);
        $scope.index = index;
        var modalInstance = $uibModal.open({
            templateUrl: '/View/Regexp/UpdateReg.html',
            controller: 'createRegexpController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.Updating = function (item, index) {
            $scope.$dismiss();
            $scope.$applyAsync(function () {
                $scope.list.splice(index, 1,item);
            });
            $scope.RegList = $scope.list;     
    }

    $scope.GenerateReqularExpression = function () {
        RegDataServices.GiveRequirement($scope.RegList).then(function (response) {
            swal({
                title: "Success!",
                text: "The regular Expression is "+response.data,
                type: "success",
                showCancelButton: true,
                confirmButtonText: "Save and Test",
                cancelButtonText: "Only Test",
                allowOutsideClick:true,
            }).then(function () {
                swal({
                    title: 'Please input your regularexpression title',
                    input: 'text',
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true,
                    preConfirm: function (title) {
                        return new Promise(function (resolve, reject) {
                            if (title === '') {
                                reject('Title is required')
                            } else {
                                var New = {};
                                New.Title = title;
                                New.Description = response.data;
                                New.RegExp = JSON.stringify($scope.RegList);

                                RegDataServices.saveRegularExpression(New).then(function (res) {
                                    swal.close();
                                    $location.path('/home').search({ RegExp: response.data });;
                                    $scope.$apply();
                                })
                                resolve()
                            }
                        })
                    },
                    allowOutsideClick: false
                }).then(function (email) {
                    
                })
                
            }, function (dismiss) {
                if (dismiss == 'cancel') {
                    $location.path('/home').search({ RegExp: response.data });;
                    $scope.$apply();
                }
            })
        }, function (error) {
            swal('Error',error.data.message, 'error');
        })
    }

}]);
myApp.controller('storeController', ['$scope', 'RegDataServices', '$location', '$route', function ($scope, RegDataServices, $location, $route) {

    RegDataServices.getRegularExpressionList().then(function (response) {
        $scope.RegList = response.data;
    })

    $scope.TestRegExp = function (regexp) {
        $location.path('/home').search({ RegExp: regexp });;
        $scope.$apply();
    }

    $scope.RemoveRegularExpression = function (data) {
        

        swal({
            title: 'Warning!',
            text: "Are You sure to Remove the Regular Expression?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {
            RegDataServices.removeRegularExpression(data).then(function (response) {
                swal({
                    title: 'Success',
                    text: 'You have successfully remove the regular expression',
                    type: 'success',
                });
                $route.reload();
            }, function (error) {
                swal('Error', 'Internal Problem', 'error');
            })
        })
    }

    $scope.UpdateRegularExpression = function (data) {
        $location.path('/UpdateRegexp').search({ id: data });;
    }

}]);
myApp.controller('updateController', ['$scope', 'localStorageService', '$window', '$uibModal', 'jsonServices', 'RegDataServices', '$location', '$routeParams', function ($scope, localStorageService, $window, $uibModal, jsonServices, RegDataServices, $location, $routeParams) {

    $scope.RegList = [];

    $scope.StartLoading = function () {
        var id = $routeParams.id;

        RegDataServices.getRegularExpressionbyId(id).then(function (response) {
            if (response.data == null) {
                swal('Error', 'Something is wrong', 'error');
            }
            $scope.singleData = response.data;
            $scope.RegList = JSON.parse(response.data.regExp);
        })
    }
   
    var authData = localStorageService.get('authorizationData');

    if (!authData) {
        $window.location.href = '#/login';
    }


    $scope.AddRequirement = function (data) {
        $scope.list.push(data);
        $scope.RegList = $scope.list;
        $scope.$dismiss();
    }

    $scope.OpenModal = function () {
        $scope.list = $scope.RegList;
        jsonServices.getRegObject().then(function (response) { $scope.Section = response.data });
        var modalInstance = $uibModal.open({
            templateUrl: '/View/Regexp/AddReg.html',
            controller: 'updateController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.Remove = function (index) {
        swal({
            title: 'Warning!',
            text: 'Are you sure to remove this requirement?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            closeOnCancel: true,
            closeOnConfirm: false
        }, function () {
            $scope.$applyAsync(function () {
                $scope.RegList.splice(index, 1);
            });
            swal.close();
        });
    }

    $scope.Update = function (index) {
        $scope.list = $scope.RegList;
        $scope.Section = angular.copy($scope.list[index]);
        $scope.index = index;
        var modalInstance = $uibModal.open({
            templateUrl: '/View/Regexp/UpdateReg.html',
            controller: 'updateController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.Updating = function (item, index) {
        $scope.$dismiss();
        $scope.$applyAsync(function () {
            $scope.list.splice(index, 1, item);
        });
        $scope.RegList = $scope.list;
    }

    $scope.GenerateReqularExpression = function () {
        RegDataServices.GiveRequirement($scope.RegList).then(function (response) {
            swal({
                title: "Success!",
                text: "The regular Expression is " + response.data,
                type: "success",
                showCancelButton: true,
                confirmButtonText: "Update and Test",
                cancelButtonText: "Only Test",
                allowOutsideClick: true,
                closeOnConfirm: false,
                closeOnCancel: false
            }).then( function () {
                var updateData = {};
                updateData.Id = $scope.singleData.id;
                updateData.Title = $scope.singleData.title;
                updateData.Description = response.data;
                updateData.RegExp = JSON.stringify($scope.RegList);


                RegDataServices.updateRegularExpression(updateData).then(function (res) {
                    $location.path('/home').search({ RegExp: response.data });;
                    $scope.$apply();
                })

            }, function (dismiss) {
                $location.path('/home').search({ RegExp: response.data });;
                $scope.$apply();
            });
        }, function (error) {
            swal('Error', error.data.message, 'error');
        })
    }


}])


//services
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

myApp.factory('jsonServices', ['$http', function ($http) {
    var fac = [];

    fac.getRegObject = function () {
        return $http.get('/Content/JSON Data/RegData.json');
    }

    return fac;
}]);

myApp.factory('RegDataServices', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    
    var fac = {};

    fac.GiveRequirement = function (data) {
        return $http.post(serviceBasePath + '/api/RegularExpression/GiveRequirements', data);
    }

    fac.saveRegularExpression = function (data) {
       return $http.post(serviceBasePath + '/api/RegularExpression/SaveRegularExpression',data);
    }

    fac.getRegularExpressionList = function () {
        return $http.get(serviceBasePath + '/api/RegularExpression/GetRegularExpression');
    }

    fac.removeRegularExpression = function (data) {
        return $http.get(serviceBasePath + '/api/RegularExpression/RemoveRegularExpression/'+data);
    }

    fac.getRegularExpressionbyId = function (data) {
        return $http.get(serviceBasePath + '/api/RegularExpression/GetRegularExpressionById/' + data);
    }

    fac.updateRegularExpression = function (data) {
        return $http.post(serviceBasePath + '/api/RegularExpression/UpdateRegularExpression', data);
    }

    return fac;
}])
