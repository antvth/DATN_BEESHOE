myApp.controller(
  "chatLieuController",
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

    $scope.listChatLieu = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedChatLieu = null;
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
        .get("http://localhost:8080/api/v1/audilog/chatlieu", config)
        .then(function (response) {
          $scope.listHistory = response.data;
        });
    }

    fetchHistortyList();
    function chatLieuList(trangThai, pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url = `http://localhost:8080/api/v1/chat-lieu/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        url += `&tenChatLieu=${$scope.searchQuery}`;
      }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listChatLieu = response.data;
          console.log("Dữ liệu trả về: ", response.data);

          // Update currentPageNumber based on the response
          $scope.currentPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm: ", error);
        });
    }
    $scope.searchVouchers = function () {
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
        "http://localhost:8080/api/v1/audilog/chatlieusearch?startDate=" +
        encodeURIComponent(formattedStartDate) +
        "&endDate=" +
        encodeURIComponent(formattedEndDate);

      $http.get(searchUrl).then(function (response) {
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
        "http://localhost:8080/api/v1/audilog/auditlogchatlieubydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };
    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchChatLieuDetail(id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var detailUrl = "http://localhost:8080/api/v1/chat-lieu/detail?id=" + id;
      $http.get(detailUrl, config).then(function (response) {
        $scope.selectedChatLieu = response.data;
        console.log("Thông tin chi tiết: ", $scope.selectedChatLieu);
        if ($scope.selectedChatLieu.trangThai === 1) {
          $scope.selectedChatLieu.trangThai = "1";
        } else {
          $scope.selectedChatLieu.trangThai = "2";
        }
        $scope.selectedChatLieu.chatLieuId = id;
      });
    }

    $scope.isthuoctinh_update = true;
    setTimeout(() => {
      $scope.updateChatLieu = function (updatedData) {
        $scope.isthuoctinh_update = !!$scope.selectedChatLieu.tenChatLieu;
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
              "http://localhost:8080/api/v1/chat-lieu/update?id=" +
              $scope.selectedChatLieu.chatLieuId;

            $http
              .put(updateUrl, updatedData, config)
              .then(function (response) {
                $("#sizeModal").modal("hide"); // Đóng modal khi thêm thành công
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
                  chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi cập nhật thông tin: ", error);
              });
          }
        });
      };
    }, 2000);

    // validation here
    $scope.isthuoctinh = true;
    $scope.istrangthai = true;
    $scope.isthuoctinhIsPresent = true;

    $scope.newChatLieu = {};
    $scope.createChatLieu = function () {
      var token = $window.localStorage.getItem("token");
                var config = {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                };
      $scope.isthuoctinh = !!$scope.newChatLieu.tenChatLieu;
      $scope.istrangthai = !!$scope.newChatLieu.trangThai;

      if (!$scope.isthuoctinh || !$scope.istrangthai) {
        return;
      } else {
        $scope.isthuoctinh = true;
        $scope.istrangthai = true;
      }

      $http
        .get(
          "http://localhost:8080/api/v1/chat-lieu/find-by-chat-lieu?chatlieu=" +
            $scope.newChatLieu.tenChatLieu, config
        )
        .then(function (response) {
          console.log("size" + response.data);
          if (response.data > 0) {
            $scope.isthuoctinhIsPresent = false; // chatlieu đã tồn tại
            return;
          }
          if (response.data === 0) {
            $scope.isthuoctinhIsPresent = true; // chatlieu OK
            Swal.fire({
              title: "Bạn có muốn thêm mới không?",
              text: "",
              icon: "question",
              showCancelButton: true,
              cancelButtonText: "Hủy bỏ",
              cancelButtonColor: "#d33",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Xác nhận",
              reverseButtons: true,
            }).then((result) => {
              if (result.isConfirmed) {
                
                $http
                  .post(
                    "http://localhost:8080/api/v1/chat-lieu/create",
                    $scope.newChatLieu,
                    config
                  )
                  .then(function (response) {
                    $("#themChatLieu").modal("hide"); // Đóng modal khi thêm thành công
                    $scope.listChatLieu.push(response.data);
                    $scope.newChatLieu = {};
                    chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
                    Swal.fire({
                      position: "top-end",
                      icon: "success",
                      title: "Thêm thành công",
                      showConfirmButton: false,
                      timer: 1500,
                      customClass: {
                        popup: "small-popup",
                      },
                    });
                  })
                  .catch(function (error) {
                    $scope.errorTenChatLieu = error.data.tenChatLieu;
                    $scope.errorTrangThai = error.data.trangThai;
                  });
              }
            });
          }
        });
    };

    setTimeout(() => {
      $scope.deleteChatLieu = function (id) {
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
              "http://localhost:8080/api/v1/chat-lieu/delete?id=" + id;

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
                  chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.fetchChatLieuDetail = function (id) {
      fetchChatLieuDetail(id);
    };

    $scope.onTrangThaiChange = function () {
      chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchChatLieu = function () {
      chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
      $scope.searchQuery = "";
      chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
      chatLieuList(id);
    } else {
      $scope.onTrangThaiChange();
    }
  }
);
