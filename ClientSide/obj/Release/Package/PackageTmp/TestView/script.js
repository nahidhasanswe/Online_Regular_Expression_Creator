var app = angular.module('plunker', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
 $routeProvider
  .when('/profile', {
    templateUrl : 'modalContainer',
    controller : 'ProfileModalCtrl'
  })
  .when('/detail', {
    templateUrl : 'detail.html',
    controller : 'DetailPageCtrl'
  })
  .otherwise({redirectTo: '/detail'});
});

app.controller('DetailPageCtrl', function($scope) {
 console.log("detail page");
});

app.controller('ProfileModalCtrl', function ($scope, $modal, $log, $location) {
    var modalInstance = $modal.open({
        templateUrl: 'modal.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
            params: function () {
                return {
                    key: 'value',
                    key2: 'value2'
                };
            }
        }
    });
    modalInstance.result.then(
        function (result) {
            alert(result);
        },
        function (result) {
            // alert(result);
            $location.path('/detail');
        }
    );
});

app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'params', '$location', function ($scope, $modalInstance, params, $location) {
    console.log(params);

    $scope.ok = function () {
        $modalInstance.close('this is result for close');
        $location.path('/detail');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('this is result for dismiss');
        $location.path('/detail');
    };
}]);






