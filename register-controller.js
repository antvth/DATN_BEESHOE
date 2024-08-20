myApp.controller("registerController", function ($http, $scope) {
    $scope.listCustomer = [];
  
    $scope.newCustomer = {
      username: "",
      email: "",
      password: "",
      role: "USER"
    };
  
    $scope.errorMessage = {
      username: "",
      email: "",
      password: "",
      message:""
    };
  
    $scope.register = function (event) {
      event.preventDefault();
      var data = {
        username: $scope.newCustomer.username,
        password: $scope.newCustomer.password,
        email: $scope.newCustomer.email,
        role: $scope.newCustomer.role,
      };
  
      $http
        .post("http://localhost:8080/api/v1/auth/register", data)
        .then(function (response) {
            $scope.listCustomer.push(response.data);
        }, function (errorResponse) {
            $scope.errorMessage = errorResponse.data;
        });
    };
});
