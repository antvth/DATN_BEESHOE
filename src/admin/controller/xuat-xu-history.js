myApp.controller(
  "XuatXuHistoryController",
  function ($http, $scope, $location, $route, $window, $sce) {
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
    $scope.listVoucherHistory = [];

    $scope.pageNumber = 0;
    $scope.pageSize = 20;

    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.searchQuery2 = "";
    $scope.searchQuery3 = "";
    function formatDateForBackend(date) {
      var day = date.getDate();
      var month = date.getMonth() + 1; // Tháng bắt đầu từ 0
      var year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
    function fetchGiamGiaList(pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var url = `http://localhost:8080/api/v1/audilog/xuatxu?page=${pageNumber}`;
      console.log(url);
      if ($scope.searchQuery) {
        if (!isNaN($scope.searchQuery)) {
          url += `&searchUsername=${$scope.searchQuery}`;
        } else {
          url += `&searchUsername=${$scope.searchQuery}`;
        }
      }
      var searchQuery3 =
        $scope.searchQuery3 instanceof Date
          ? new Date($scope.searchQuery3.getTime() + 86400000) // Thêm 1 ngày (1 ngày = 86400000 milliseconds)
          : null;

      if (searchQuery3) {
        var formattedDate = searchQuery3.toISOString().split("T")[0];
        url += `&startDate=${formattedDate}&endDate=${formattedDate}`;
      }

      console.log(searchQuery3);

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listVoucherHistory = response.data;

          // Update currentPageNumber based on the response
          $scope.currenPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm: ", error);
        });
    }

    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        fetchGiamGiaList($scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      fetchGiamGiaList($scope.pageNumber);
    };

    $scope.searchKhach = function () {
      fetchGiamGiaList($scope.pageNumber);
    };

    // $scope.onTrangThaiChange = function () {
    //   fetchGiamGiaList("");
    // };

    $scope.searchNgay = function () {
      fetchGiamGiaList($scope.pageNumber);
    };

    $scope.searchNgayBatDau = function () {
      fetchGiamGiaList($scope.pageNumber);
    };
    $scope.searchKetThuc = function () {
      fetchGiamGiaList($scope.pageNumber);
    };
    // $scope.searchTenKhach = function () {
    //   fetchGiamGiaList($scope.pageNumber);
    // };
    fetchGiamGiaList($scope.pageNumber);
    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
  }
);
