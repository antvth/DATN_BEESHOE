myAppCustom.controller(
  "registerCutomController",
  function ($scope, $http, $window) {
    $scope.register = function () {
      var data = {
        username: $scope.usernameRegis,
        email: $scope.emailRegis,
        password: $scope.passwordRegis,
      };

      $http
        .post("http://localhost:8080/api/v1/auth/register", data)
        .then(function (response) {
          $window.location.reload();
        }).catch(function(error) {
          $scope.errorUsername = error.data.username;
          $scope.errorPassword = error.data.password;
          $scope.errorEmail = error.data.email;
        });
    };
  }
);
