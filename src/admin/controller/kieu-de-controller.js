myApp.controller(
  "kieuDeController",
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
    $scope.listKieuDe = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedKieuDe = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    $scope.pageSize = 20;
    function kieuDeList(trangThai, pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url = `http://localhost:8080/api/v1/kieu-de/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        url += `&tenKieuDe=${$scope.searchQuery}`;
      }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listKieuDe = response.data;
          console.log("Dữ liệu trả về: ", response.data);

          $scope.currentPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
          console.log($scope.listKieuDe.length);
          if ($scope.listKieuDe.length < $scope.pageSize) {
            $scope.showNextButtonSpInCart = false; // Ẩn nút "Next"
            console.log("ok");
          } else {
            $scope.showNextButtonSpInCart = true; // Hiển thị nút "Next"
            console.log("ok123");
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
        .get("http://localhost:8080/api/v1/audilog/kieude", config)
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
        "http://localhost:8080/api/v1/audilog/kieudesearch?startDate=" +
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
        "http://localhost:8080/api/v1/audilog/auditlogkieudebydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };

    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchKieuDeDetail(id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var detailUrl = "http://localhost:8080/api/v1/kieu-de/detail?id=" + id;
      $http.get(detailUrl, config).then(function (response) {
        $scope.selectedKieuDe = response.data;
        console.log("Thông tin chi tiết: ", $scope.selectedKieuDe);
        if ($scope.selectedKieuDe.trangThai === 1) {
          $scope.selectedKieuDe.trangThai = "1";
        } else {
          $scope.selectedKieuDe.trangThai = "2";
        }
        $scope.selectedKieuDe.kieuDeId = id;
      });
    }

    setTimeout(() => {
      $scope.updateKieuDe = function (updatedData) {
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
              "http://localhost:8080/api/v1/kieu-de/update?id=" +
              $scope.selectedKieuDe.kieuDeId;
            $http
              .put(updateUrl, updatedData, config)
              .then(function (response) {
                $("#sua").modal("hide");
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
                  kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                $scope.errortenDe = error.data.tenDe;
                $scope.errortrangThai = error.data.trangThai;
              });
          }
        });
      };
    }, 2000);

    $scope.newKieuDe = {};
    setTimeout(() => {
      $scope.createKieuDe = function () {
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
                "http://localhost:8080/api/v1/kieu-de/create",
                $scope.newKieuDe,
                config
              )
              .then(function (response) {
                $scope.listKieuDe.push(response.data);
                $("#soleModal1").modal("hide");
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
                  kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                $scope.errortenDe = error.data.tenDe;
                $scope.errortrangThai = error.data.trangThai;
              });
          }
        });
      };
    }, 2000);

    $scope.deleteKieuDe = function (id) {
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
            "http://localhost:8080/api/v1/kieu-de/delete?id=" + id;

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
                kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Lỗi khi xóa chất liệu: ", error);
            });
        }
      });
    };

    $scope.fetchKieuDeDetail = function (id) {
      fetchKieuDeDetail(id);
    };

    $scope.onTrangThaiChange = function () {
      kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchKieuDe = function () {
      kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
      $scope.searchQuery = "";
      $scope.selectedTrangThai = "";
      kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
      kieuDeList(id);
    } else {
      $scope.onTrangThaiChange();
    }
  }
);
