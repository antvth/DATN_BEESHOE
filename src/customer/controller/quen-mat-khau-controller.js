myAppCustom.controller(
  "QuenMatKhauController",
  function ($scope, $http, $window, $location, $route, $routeParams) {
    $scope.email = "";
    $scope.forgotPassword = function () {
      $http
        .post(
          "http://localhost:8080/api/v1/auth/forgot-password?email=" +
            $scope.email
        )
        .then(function (response) {
        });
    };
  }
);
