myAppCustom.controller(
  "loginCutomController",
  function ($scope, $http, $window) {
    $scope.loggedInUsername = "";

    var token = $window.localStorage.getItem("token-customer");
    if (token) {
      $scope.isLoggedIn = true;
    } else {
      $scope.isLoggedIn = false;
    }

    // Lấy thông tin tên người dùng từ API hoặc từ localStorage (tùy thuộc vào cách bạn lưu trữ)
    var username = $window.localStorage.getItem("username");
    if (username) {
      $scope.loggedInUsername = username;
    }

    $scope.loginCusTom = function () {
      var data = {
        username: $scope.username,
        password: $scope.password,
      };

      $http
        .post("http://localhost:8080/api/v1/auth/login", data)
        .then(function (response) {
          $window.localStorage.setItem(
            "token-customer",
            response.data.accessToken
          );
          $window.localStorage.setItem("role-customer", response.data.role);
          $window.localStorage.setItem("username", response.data.username); // Lưu tên người dùng

          $scope.loggedInUsername = response.data.username;
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Đăng nhập thành công",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup",
            },
          });
          window.location.href =
            "http://127.0.0.1:5505/src/customer/index-customer.html#/home";
          // $window.location.reload();
        })
        .catch(function (error) {
          $scope.errorUsername = error.data.username;
          $scope.errorPassword = error.data.password;
        });
    };

    $scope.logout = function () {
      // Xóa token khỏi localStorage
      $window.localStorage.removeItem("token-customer");
      $window.localStorage.removeItem("username"); // Xóa tên người dùng khi đăng xuất
      $window.localStorage.removeItem("role-customer"); // Xóa tên người dùng khi đăng xuất
      $scope.isLoggedIn = false;
      $scope.loggedInUsername = ""; // Đặt giá trị về rỗng khi đăng xuất
    };
  }
);
