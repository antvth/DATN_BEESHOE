myApp.controller(
  "thuongHieuController",
  function ($http, $scope, $location, $window, $sce) {
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
    $scope.listThuongHieu = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedThuongHieu = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    $scope.pageSize = 20;
    function thuongHieuList(trangThai, pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url = `http://localhost:8080/api/v1/thuong-hieu/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        url += `&tenThuongHieu=${$scope.searchQuery}`;
      }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listThuongHieu = response.data;
          console.log("Dữ liệu trả về: ", response.data);

          // Update currentPageNumber based on the response
          $scope.currentPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
          if ($scope.listThuongHieu.length < $scope.pageSize) {
            $scope.showNextButtonSpInCart = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButtonSpInCart = true; // Hiển thị nút "Next"
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm: ", error);
        });
    }
    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
    function fetchHistortyList() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/audilog/thuonghieu", config)
        .then(function (response) {
          $scope.listHistory = response.data;
        });
    }

    fetchHistortyList();

    $scope.searchVouchers = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      // Make sure both startDate and endDate are provided
      if (!$scope.startDate || !$scope.endDate) {
        // Handle error or provide user feedback
        return;
      }

      var formattedStartDate = new Date($scope.startDate)
        .toISOString()
        .split("T")[0];
      var formattedEndDate = new Date($scope.endDate)
        .toISOString()
        .split("T")[0];

      var searchUrl =
        "http://localhost:8080/api/v1/audilog/thuonghieusearch?startDate=" +
        encodeURIComponent(formattedStartDate) +
        "&endDate=" +
        encodeURIComponent(formattedEndDate);

      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };
    $scope.searchVouchersByDay = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var formattedStartDate = new Date($scope.searchDate)
        .toISOString()
        .split("T")[0];

      var searchUrl =
        "http://localhost:8080/api/v1/audilog/auditlogthuonghieubydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };

    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchThuongHieuDetail(id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var detailUrl =
        "http://localhost:8080/api/v1/thuong-hieu/detail?id=" + id;
      $http.get(detailUrl, config).then(function (response) {
        $scope.selectedThuongHieu = response.data;
        console.log("Thông tin chi tiết: ", $scope.selectedThuongHieu);
        if ($scope.selectedThuongHieu.trangThai === 1) {
          $scope.selectedThuongHieu.trangThai = "1";
        } else {
          $scope.selectedThuongHieu.trangThai = "2";
        }
        $scope.selectedThuongHieu.thuongHieuId = id;
      });
    }

    setTimeout(() => {
      $scope.updateThuongHieu = function (updatedData) {
        Swal.fire({
          title: "Bạn có muốn chỉnh sửa không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            var updateUrl =
              "http://localhost:8080/api/v1/thuong-hieu/update?id=" +
              $scope.selectedThuongHieu.thuongHieuId;
            $http
              .put(updateUrl, updatedData, config)
              .then(function (response) {
                $("#suaThuongHieuModal").modal("hide");
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Chỉnh sửa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                $scope.errortenThuongHieu = error.data.tenThuongHieu;
                $scope.errortrangThai = error.data.trangThai;
              });
          }
        });
      };
    }, 2000);

    $scope.newThuongHieu = {};
    setTimeout(() => {
      $scope.createThuongHieu = function () {
        Swal.fire({
          title: "Bạn có muốn thêm mới không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .post(
                "http://localhost:8080/api/v1/thuong-hieu/create",
                $scope.newThuongHieu,
                config
              )
              .then(function (response) {
                $scope.listThuongHieu.push(response.data);
                $("#thuongHieuModal").modal("hide");
                $scope.newThuongHieu = {};
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                $scope.errortenThuongHieu = error.data.tenThuongHieu;
                $scope.errortrangThai = error.data.trangThai;
              });
          }
        });
      };
    }, 2000);

    setTimeout(() => {
      $scope.deleteThuongHieu = function (id) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        Swal.fire({
          title: "Bạn có muốn vô hiệu hóa không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            var deleteUrl =
              "http://localhost:8080/api/v1/thuong-hieu/delete?id=" + id;

            $http
              .put(deleteUrl, null,config)
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Vô hiệu hóa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi xóa thương hiệu: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.fetchThuongHieuDetail = function (id) {
      fetchThuongHieuDetail(id);
    };

    $scope.onTrangThaiChange = function () {
      thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchThuongHieu = function () {
      thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
      $scope.searchQuery = "";
      thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
      thuongHieuList(id);
    } else {
      $scope.onTrangThaiChange();
    }
  }
);
