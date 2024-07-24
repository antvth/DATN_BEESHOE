myApp.controller(
  "sizeController",
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
    $scope.listSize = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedSize = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function sizeList(trangThai, pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url = `http://localhost:8080/api/v1/size/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        url += `&size=${$scope.searchQuery}`;
      }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listSize = response.data;
          console.log("Dữ liệu trả về: ", response.data);

          // Update currentPageNumber based on the response
          $scope.currentPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
          if ($scope.listSize.length < 20) {
            $scope.showNextButtonSpInCart = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButtonSpInCart = true; // Hiển thị nút "Next"
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm: ", error);
        });
    }

    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        sizeList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };
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
        .get("http://localhost:8080/api/v1/audilog/size", config)
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
        "http://localhost:8080/api/v1/audilog/sizesearch?startDate=" +
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
        "http://localhost:8080/api/v1/audilog/auditlogsizebydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      sizeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchSizedetail(id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var detailUrl = "http://localhost:8080/api/v1/size/detail?id=" + id;
      $http.get(detailUrl, config).then(function (response) {
        $scope.selectedSize = response.data;
        console.log("Thông tin chi tiết: ", $scope.selectedSize);
        if ($scope.selectedSize.trangThai === 1) {
          $scope.selectedSize.trangThai = "1";
        } else {
          $scope.selectedSize.trangThai = "2";
        }
        $scope.selectedSize.sizeId = id;
      });
    }

    // validation here
    $scope.isthuoctinh_update = true;
    $scope.istrangthai_update = true;

    setTimeout(() => {
      $scope.updateSize = function (updatedData) {
        $scope.isthuoctinh_update = !!$scope.selectedSize.size;
        $scope.istrangthai_update = !!$scope.selectedSize.trangThai;

        if (!$scope.isthuoctinh_update || !$scope.istrangthai_update) {
          return;
        } else {
          $scope.isthuoctinh_update = true;
          $scope.istrangthai_update = true;
        }

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
              "http://localhost:8080/api/v1/size/update?id=" +
              $scope.selectedSize.sizeId;

            $http
              .put(updateUrl, updatedData, config)
              .then(function (response) {
                $("#sua").modal("hide");
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
                  sizeList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi cập nhật thông tin: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.newSize = {};

    // validation here
    $scope.isthuoctinh = true;
    $scope.istrangthai = true;
    $scope.isthuoctinhIsPresent = true;

    setTimeout(() => {
      $scope.createSize = function () {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $scope.isthuoctinh = !!$scope.newSize.size;
        $scope.istrangthai = !!$scope.newSize.trangThai;

        if (!$scope.isthuoctinh || !$scope.istrangthai) {
          return;
        } else {
          $scope.isthuoctinh = true;
          $scope.istrangthai = true;
        }

        $http
          .get(
            "http://localhost:8080/api/v1/size/find-by-size?size=" +
              $scope.newSize.size,
            config
          )
          .then(function (response) {
            if (response.data > 0) {
              $scope.isthuoctinhIsPresent = false; // size đã tồn tại
              return;
            }
            if (response.data === 0) {
              $scope.isthuoctinhIsPresent = true; // size OK

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
                  $http
                    .post(
                      "http://localhost:8080/api/v1/size/create",
                      $scope.newSize,
                      config
                    )
                    .then(function (response) {
                      $scope.listSize.push(response.data);
                      $("#sizeModal").modal("hide");
                      $scope.newSize = {};
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
                        sizeList($scope.selectedTrangThai, $scope.pageNumber);
                      });
                    });
                }
              });
            }
          });
      };
    }, 2000);

    setTimeout(() => {
      $scope.deleteSize = function (id) {
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
            var deleteUrl = "http://localhost:8080/api/v1/size/delete?id=" + id;

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
                  sizeList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.fetchSizedetail = function (id) {
      fetchSizedetail(id);
    };

    $scope.onTrangThaiChange = function () {
      sizeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchSize = function () {
      sizeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
      $scope.searchQuery = "";
      sizeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
      sizeList(id);
    } else {
      $scope.onTrangThaiChange();
    }
  }
);
