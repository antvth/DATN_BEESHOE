myApp.controller(
  "danhMucController",
  function ($http, $scope, $location, $window) {
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
    $scope.listDanhMuc = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedDanhMuc = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;
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
        .get("http://localhost:8080/api/v1/audilog/danhmuc", config)
        .then(function (response) {
          $scope.listHistory = response.data;
        });
    }

    $scope.pageSize = 20;
    fetchHistortyList();
    function danhMucList(trangThai, pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url = `http://localhost:8080/api/v1/danh-muc/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        url += `&tenDanhMuc=${$scope.searchQuery}`;
      }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listDanhMuc = response.data;
          console.log("Dữ liệu trả về: ", response.data);

          // Update currentPageNumber based on the response
          $scope.currentPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
          if ($scope.listDanhMuc.length < $scope.pageSize) {
            $scope.showNextButtonSpInCart = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButtonSpInCart = true; // Hiển thị nút "Next"
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm: ", error);
        });
    }

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
        "http://localhost:8080/api/v1/audilog/danhmucsearch?startDate=" +
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
        "http://localhost:8080/api/v1/audilog/auditlogdanhmucbydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };
    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        danhMucList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchDanhMucDetail(id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var detailUrl = "http://localhost:8080/api/v1/danh-muc/detail?id=" + id;
      $http.get(detailUrl, config).then(function (response) {
        $scope.selectedDanhMuc = response.data;
        console.log("Thông tin chi tiết: ", $scope.selectedDanhMuc);
        if ($scope.selectedDanhMuc.trangThai === 1) {
          $scope.selectedDanhMuc.trangThai = "1";
        } else {
          $scope.selectedDanhMuc.trangThai = "2";
        }
        $scope.selectedDanhMuc.danhMucId = id;
      });
    }

    setTimeout(() => {
      $scope.updateDanhMuc = function (updatedData) {
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
              "http://localhost:8080/api/v1/danh-muc/update?id=" +
              $scope.selectedDanhMuc.danhMucId;

            $http
              .put(updateUrl, updatedData, config)
              .then(function (response) {
                $("#suaDanhMucModal").modal("hide");
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Cập nhật thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  danhMucList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                $scope.errortenDanhMuc = error.data.tenDanhMuc;
                $scope.errortrangThai = error.data.trangThai;
              });
          }
        });
      };
    }, 2000);

    $scope.newDanhMuc = {};
    setTimeout(() => {
      $scope.createDanhMuc = function () {
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
                "http://localhost:8080/api/v1/danh-muc/create",
                $scope.newDanhMuc,
                config
              )
              .then(function (response) {
                $scope.listDanhMuc.push(response.data);
                $("#danhMucModal").modal("hide");
                $scope.newDanhMuc = {};
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
                  danhMucList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                $scope.errortenDanhMuc = error.data.tenDanhMuc;
                $scope.errortrangThai = error.data.trangThai;
              });
          }
        });
      };
    }, 2000);

    setTimeout(() => {
      $scope.deleteDanhMuc = function (id) {
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
              "http://localhost:8080/api/v1/danh-muc/delete?id=" + id;

            $http
              .put(deleteUrl, null, config)
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
                  danhMucList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.fetchDanhMucDetail = function (id) {
      fetchDanhMucDetail(id);
    };

    $scope.onTrangThaiChange = function () {
      danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchDanhMuc = function () {
      danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
      $scope.searchQuery = "";
      $scope.selectedTrangThai = "";
      // danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
      danhMucList(id);
    } else {
      $scope.onTrangThaiChange();
    }
  }
);
