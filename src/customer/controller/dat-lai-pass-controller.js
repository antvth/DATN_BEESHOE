myAppCustom.controller(
  "DatLaiPassWordsController",
  function ($scope, $http, $routeParams) {
    var id = $routeParams.id;
    $scope.password = ''
    $scope.datLai = function () {
      $http
        .put(
          "http://localhost:8080/api/v1/auth/dat-lai-pass?id=" +
            id +
            "&password=" +
            $scope.password
        )
        .then(function (response) {
            console.log(response.data);
        });
    };
  }
);
