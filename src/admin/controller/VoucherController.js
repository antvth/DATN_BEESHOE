myApp.controller(
  "VoucherController",
  function ($http, $scope, $location, $route, $window, $sce, $timeout) {
    var role = $window.localStorage.getItem("role");
    var token = $window.localStorage.getItem("token");
    console.log(token);
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

    $scope.listVoucher = [];
    $scope.listVoucherHistory = [];

    $scope.pageNumber = 0;
    $scope.pageSize = 20;
    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
    // Trong hàm fetchVoucherList()
    $scope.fetchVoucherList = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url =
        "http://localhost:8080/api/v1/voucher/hien-thi" +
        "?pageNumber=" +
        $scope.pageNumber +
        "&pageSize=" +
        $scope.pageSize;

      if ($scope.searchQuery) {
        if (!isNaN($scope.searchQuery)) {
          url += `&tenVoucher=${$scope.searchQuery}`;
        } else {
          url += `&maVoucher=${$scope.searchQuery}`;
        }
      }
      if ($scope.searchQuery2) {
        if (!isNaN($scope.searchQuery2)) {
          url += `&maVoucher=${$scope.searchQuery2}`;
        } else {
          url += `&tenVoucher=${$scope.searchQuery2}`;
        }
      }
      if ($scope.searchQuery3) {
        url += `&trangThai=${$scope.searchQuery3}`;
      }
      //
      $http.get(url, config).then(function (response) {
        $scope.listVoucher = response.data;
        // updateVoucherStatus();
        // Kiểm tra số lượng trang và điều chỉnh hiển thị nút "Next"
        if ($scope.listVoucher.length < $scope.pageSize) {
          $scope.showNextButton = false; // Ẩn nút "Next"
        } else {
          $scope.showNextButton = true; // Hiển thị nút "Next"
        }
      });
    };
    updateVoucherStatus();
    function updateVoucherStatus() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http
        .get("http://localhost:8080/api/v1/voucher/updateStatus", config)
        .then(function (response) {
          // Không cần hiển thị thông báo, chỉ làm mới danh sách voucher
          $scope.fetchVoucherList();
        })
        .catch(function (error) {
          console.error("Lỗi khi cập nhật trạng thái voucher", error);
        });
    }
    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
    $scope.fetchVoucherList();

    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        $scope.fetchVoucherList();
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPage = function () {
      $scope.pageNumber++;
      $scope.fetchVoucherList();
    };

    $scope.previousDate = null;
    $scope.searchKhach = function () {
      $scope.fetchVoucherList();
    };
    $scope.onTrangThaiChange = function () {
      $scope.fetchVoucherList();
    };

    $scope.searchGiamGia = function () {
      $scope.fetchVoucherList();
    };
    $scope.searchTenKhach = function () {
      $scope.fetchVoucherList();
    };
    $scope.refresh = function () {
      // Thực hiện các hành động cần thiết để làm mới dữ liệu
      // Ví dụ: gọi các hàm search hoặc reset giá trị của các biến tìm kiếm
      $scope.searchQuery = "";
      $scope.searchQuery2 = "";
      $scope.selectedTrangThai = "";
      // Gọi các hàm search tương ứng nếu cần
      $scope.searchKhach();
      $scope.searchTenKhach();
      $scope.onTrangThaiChange();
    };
    function fetchVoucherHistortyList() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/audilog/voucher", config)
        .then(function (response) {
          $scope.listVoucherHistory = response.data;
        });
    }

    fetchVoucherHistortyList();

    setTimeout(() => {
      $scope.updateVoucherStatus = function (id, event) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        Swal.fire({
          title: "Bạn có muốn chuyển trạng thái voucher này không?",
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
            event.preventDefault();

            $http
              .get(
                "http://localhost:8080/api/v1/voucher/updateStatus/" + id,
                config
              )
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Cập nhật voucher thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Thêm class cho message
                  },
                });
                $route.reload();
              })
              .catch(function (error) {
                console.error("Error updating Voucher:", error);
              });
          }
        });
      };
    }, 2000);

    $scope.maVoucher = "GG_" + new Date().getTime();
    $scope.ngayBatDau = new Date(); // Lấy ngày hôm nay

    // Thiết lập giờ, phút, giây là 00:00:00
    $scope.ngayBatDau.setHours(0, 0, 0, 0);
    $scope.hinhThucGiam = "2";
    setTimeout(() => {
      $scope.themVoucher = function () {
        var ngayBatDau = new Date($scope.ngayBatDau);
        var ngayKetThuc = new Date($scope.ngayKetThuc);
        if (ngayBatDau >= ngayKetThuc) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Thêm class cho message
            },
          });
          return;
        }
        if (
          !$scope.maVoucher ||
          !$scope.tenVoucher ||
          !$scope.soLuongMa ||
          !$scope.giaTriToiThieuDonhang ||
          !$scope.giaTriGiam ||
          !$scope.hinhThucGiam ||
          !$scope.ngayBatDau ||
          !$scope.ngayKetThuc
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Vui lòng điền đầy đủ thông tin",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup",
            },
          });
          return;
        }
        var ngayHienTai = new Date();
        if (ngayKetThuc <= ngayHienTai) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ngày kết thúc phải lớn hơn ngày hiện tại",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Thêm class cho message
            },
          });
          return;
        }
        if (
          $scope.hinhThucGiam == 1 &&
          ($scope.giaTriGiam <= 0 || $scope.giaTriGiam > 100)
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title:
              "Giá trị mức giảm phải nằm trong khoảng từ 0 đến 100 khi hình thức giảm là phần trăm",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Thêm class cho message
            },
          });
          return;
        }

        if (
          $scope.giaTriToiThieuDonhang < 0 ||
          $scope.soLuongMa < 0 ||
          $scope.giaTriGiam < 0
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Giá trị không hợp lệ",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup",
            },
          });
          return;
        }
        if ($scope.giaTriToiThieuDonhang <= $scope.giaTriGiam) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Giá trị tối thiểu đơn hàng phải lớn hơn mức giảm",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Thêm class cho message
            },
          });
          return;
        }

        Swal.fire({
          title: "Bạn có muốn thêm voucher không?",
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
            var dataToSend = {
              maVoucher: $scope.maVoucher,
              tenVoucher: $scope.tenVoucher,
              soLuongMa: $scope.soLuongMa,
              giaTriToiThieuDonhang: $scope.giaTriToiThieuDonhang,
              giaTriGiam: $scope.giaTriGiam,
              hinhThucGiam: $scope.hinhThucGiam,
              trangThai: 1,
              ngayBatDau: $scope.ngayBatDau,
              ngayKetThuc: $scope.ngayKetThuc,
            };
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .post(
                "http://localhost:8080/api/v1/voucher/create",
                dataToSend,
                config
              )
              .then(function (response) {
                $scope.listVoucher.push(response.data);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Thêm class cho message
                  },
                });
                $location.path("/voucher");
              })
              .catch(function (error) {
                console.error("Error:", error);
              });
          }
        });
      };
    }, 2000);
    $scope.isQuantityEnabled = true;

    $scope.showBrandSelect = false;
  }
);
