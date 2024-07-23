myApp.controller(
  "sanPhamChiTietController",
  function ($http, $scope, $routeParams, $window) {
    var role = $window.localStorage.getItem("role");
    if (role === "USER") {
      Swal.fire({
        icon: "error",
        title: "Bạn không có quyền truy cập",
        text: "Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.",
      });
      window.location.href =
        "http://127.0.0.1:5505/src/admin/index-admin.html#/admin/login";
    }
    if (role === null) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng đăng nhập",
        text: "Vui lòng đăng nhập để có thể sử dụng chức năng.",
      });
      window.location.href =
        "http://127.0.0.1:5505/src/admin/index-admin.html#/admin/login";
    }

    function getRole() {
      if (role === "ADMIN" || role === "MANAGER") {
        $scope.isAdmin = true;
      }
    }

    getRole();
    var id = $routeParams.id;

    $scope.idUpdate = id;

    $scope.listSanPhamChiTiet = [];
    $scope.pageNumber = 0;
    $scope.pageSize = 20;
    $scope.getlistSanPhamChiTiet = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-chi-tiet/show?id=" +
            id +
            "&pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize,
          config
        )
        .then(function (response) {
          $scope.listSanPhamChiTiet = response.data;
          if ($scope.listSanPhamChiTiet.length < $scope.pageSize) {
            $scope.showNextButton = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButton = true; // Hiển thị nút "Next"
          }
        });
    };

    $scope.getlistSanPhamChiTiet();

    $scope.previousPage = function () {
      if ($scope.pageNumber > -1) {
        $scope.pageNumber--;
        $scope.getlistSanPhamChiTiet();
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      $scope.getlistSanPhamChiTiet();
    };

    $scope.lamMoiChiTietSanPham = function () {
      $scope.trangThai = "";
      $scope.locSize = "";
      $scope.locMaterial = "";
      $scope.locMauSac = "";
      $scope.getlistSanPhamChiTiet();
    };

    // TODO: Lấy ra tất cả bản ghi của chất liệu
    $scope.listChatLieu = [];
    $scope.getListChatLieu = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/chat-lieu/show", config)
        .then(function (response) {
          $scope.listChatLieu = response.data;
        });
    };
    $scope.getListChatLieu();

    // TODO: Lấy ra tất cả bản ghi của size
    $scope.listSize = [];
    $scope.getListSize = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/size/show", config)
        .then(function (response) {
          $scope.listSize = response.data;
        });
    };
    $scope.getListSize();

    // TODO: Lấy ra tất cả bản ghi của màu sắc
    $scope.listMauSac = [];
    $scope.getListMauSac = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/mau-sac/show", config)
        .then(function (response) {
          $scope.listMauSac = response.data;
        });
    };
    $scope.getListMauSac();

    // TODO:  Lọc sản phẩm theo size
    $scope.trangThai;
    $scope.filterStatus = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.trangThai === "") {
        $scope.getlistSanPhamChiTiet();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-chi-tiet/show-by-status?id=" +
              id +
              "&trangThai=" +
              $scope.trangThai,
            config
          )
          .then(function (response) {
            $scope.listSanPhamChiTiet = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo size
    $scope.locSize;
    $scope.filterSize = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locSize === "") {
        $scope.getlistSanPhamChiTiet();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-chi-tiet/show-by-size?id=" +
              id +
              "&size=" +
              $scope.locSize,
            config
          )
          .then(function (response) {
            $scope.listSanPhamChiTiet = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo chất liệu
    $scope.locMaterial = "";
    $scope.filterMaterial = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locMaterial === "") {
        $scope.getlistSanPhamChiTiet();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-chi-tiet/show-by-key?id=" +
              id +
              "&key=" +
              $scope.locMaterial,
            config
          )
          .then(function (response) {
            $scope.listSanPhamChiTiet = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo màu sắc
    $scope.locMauSac = "";
    $scope.filterColor = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locMauSac === "") {
        $scope.getlistSanPhamChiTiet();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-chi-tiet/show-by-key?id=" +
              id +
              "&key=" +
              $scope.locMauSac,
            config
          )
          .then(function (response) {
            $scope.listSanPhamChiTiet = response.data;
          });
      }
    };
  }
);
