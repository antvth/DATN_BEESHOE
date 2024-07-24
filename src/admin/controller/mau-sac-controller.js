myApp.controller(
  "mauSacController",
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
    $scope.listMauSac = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedMauSac = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function mauSacList(trangThai, pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url = `http://localhost:8080/api/v1/mau-sac/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        url += `&tenMauSac=${$scope.searchQuery}`;
      }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listMauSac = response.data;
          console.log("Dữ liệu trả về: ", response.data);

          // Update currentPageNumber based on the response
          $scope.currentPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm: ", error);
        });
    }
    $scope.formatMa = function (username) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
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
        .get("http://localhost:8080/api/v1/audilog/mausac", config)
        .then(function (response) {
          $scope.listHistory = response.data;
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
        "http://localhost:8080/api/v1/audilog/mausacsearch?startDate=" +
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
        "http://localhost:8080/api/v1/audilog/auditlogmausacbydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };

    fetchHistortyList();
    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        mauSacList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      mauSacList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchMauSacdetail(id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var detailUrl = "http://localhost:8080/api/v1/mau-sac/detail?id=" + id;
      $http.get(detailUrl, config).then(function (response) {
        $scope.selectedMauSac = response.data;
        console.log("Thông tin chi tiết: ", $scope.selectedMauSac);
        if ($scope.selectedMauSac.trangThai === 1) {
          $scope.selectedMauSac.trangThai = "1";
        } else {
          $scope.selectedMauSac.trangThai = "2";
        }
        $scope.selectedMauSac.mauSacId = id;
      });
    }
    $scope.isthuoctinh_update = true;

    setTimeout(() => {
      $scope.updateMauSac = function (updatedData) {
        $scope.isthuoctinh_update = !!$scope.selectedMauSac.tenMauSac;
        if (!$scope.isthuoctinh_update) {
          return;
        } else {
          $scope.isthuoctinh_update = true;
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
              "http://localhost:8080/api/v1/mau-sac/update?id=" +
              $scope.selectedMauSac.mauSacId;

            $http
              .put(updateUrl, updatedData, config)
              .then(function (response) {
                $("#sua").modal("hide"); // Đóng modal khi thêm thành công
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
                  mauSacList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi cập nhật thông tin: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.newMauSac = {};
    // validation here
    $scope.isthuoctinh = true;
    $scope.istrangthai = true;
    $scope.isthuoctinhIsPresent = true;
    setTimeout(() => {
      $scope.createMauSac = function () {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $scope.isthuoctinh = !!$scope.newMauSac.tenMauSac;
        $scope.istrangthai = !!$scope.newMauSac.trangThai;

        if (!$scope.isthuoctinh || !$scope.istrangthai) {
          return;
        } else {
          $scope.isthuoctinh = true;
          $scope.istrangthai = true;
        }

        $http
          .get(
            "http://localhost:8080/api/v1/mau-sac/find-by-mau-sac?mausac=" +
              $scope.newMauSac.tenMauSac,
            config
          )
          .then(function (response) {
            if (response.data > 0) {
              $scope.isthuoctinhIsPresent = false; // mausac đã tồn tại
              return;
            }
            if (response.data === 0) {
              $scope.isthuoctinhIsPresent = true; // mausac OK
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
                  "http://localhost:8080/api/v1/mau-sac/create",
                  $scope.newMauSac,
                  config
                )
                .then(function (response) {
                  $("#sizeModal").modal("hide"); // Đóng modal khi thêm thành công
                  $scope.listMauSac.push(response.data);
                  $scope.newMauSac = {};
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
                    mauSacList($scope.selectedTrangThai, $scope.pageNumber);
                  });
                });
                }
              });
            }
          });
      };
    }, 2000);

    setTimeout(() => {
      $scope.deleteMauSac = function (id) {
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
              "http://localhost:8080/api/v1/mau-sac/delete?id=" + id;

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
                  mauSacList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.fetchMauSacdetail = function (id) {
      fetchMauSacdetail(id);
    };

    $scope.onTrangThaiChange = function () {
      mauSacList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchMauSac = function () {
      mauSacList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
      $scope.searchQuery = "";
      mauSacList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
      mauSacList(id);
    } else {
      $scope.onTrangThaiChange();
    }
  }
);
