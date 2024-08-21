myApp.controller(
  "voucherChiTietController",
  function ($http, $scope, $routeParams, $location, $window) {
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
    $scope.getvoucherchitiet = function (id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const apiUrl = "http://localhost:8080/api/v1/voucher/" + id;
      $http.get(apiUrl, config).then(function (response) {
        response.data.ngayBatDau = new Date(response.data.ngayBatDau);
        response.data.ngayKetThuc = new Date(response.data.ngayKetThuc);
        $scope.voucherchitiet = response.data;
      });
    };

    // Xác định `id` từ `$routeParams`
    var id = $routeParams.id;

    $scope.getvoucherchitiet(id);

    setTimeout(() => {
      $scope.updateVoucher = function (id) {
        var ngayBatDau = new Date($scope.voucherchitiet.ngayBatDau);
        var ngayKetThuc = new Date($scope.voucherchitiet.ngayKetThuc);
        if (ngayBatDau >= ngayKetThuc) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Thêm class cho message
            },
          });
          return;
        }
        if (
          $scope.voucherchitiet.soLuongMa < $scope.voucherchitiet.soLuongDung
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Số lượng không thể nhỏ hơn số lượng đã dùng",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup",
            },
          });
          return;
        }
        if (
          $scope.voucherchitiet.giaTriToiThieuDonhang <=
          $scope.voucherchitiet.giaTriGiam
        ) {
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

        if (
          !$scope.voucherchitiet.maVoucher ||
          !$scope.voucherchitiet.tenVoucher ||
          !$scope.voucherchitiet.soLuongMa ||
          !$scope.voucherchitiet.giaTriToiThieuDonhang ||
          !$scope.voucherchitiet.giaTriGiam ||
          !$scope.voucherchitiet.hinhThucGiam ||
          !$scope.voucherchitiet.ngayBatDau ||
          !$scope.voucherchitiet.ngayKetThuc
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
        if (
          $scope.voucherchitiet.hinhThucGiam == 1 &&
          ($scope.voucherchitiet.giaTriGiam <= 0 ||
            $scope.voucherchitiet.giaTriGiam > 100)
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title:
              "Giá trị mức giảm phải nằm trong khoảng từ 0 đến 50 khi hình thức giảm là phần trăm",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Thêm class cho message
            },
          });
          return;
        }

        if (
          $scope.voucherchitiet.giaTriToiThieuDonhang < 0 ||
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

        Swal.fire({
          title: "Bạn có cập nhật voucher này không ?",
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
            var dataToSend = {
              maVoucher: $scope.voucherchitiet.maVoucher,
              tenVoucher: $scope.voucherchitiet.tenVoucher,
              soLuongMa: $scope.voucherchitiet.soLuongMa,
              giaTriToiThieuDonhang:
                $scope.voucherchitiet.giaTriToiThieuDonhang,
              giaTriGiam: $scope.voucherchitiet.giaTriGiam,
              hinhThucGiam: $scope.voucherchitiet.hinhThucGiam,
              ngayBatDau: $scope.voucherchitiet.ngayBatDau,
              ngayKetThuc: $scope.voucherchitiet.ngayKetThuc,
              trangThai: 1,
            };
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .put(
                "http://localhost:8080/api/v1/voucher/update/" + id,
                dataToSend,
                config
              )
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Sửa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                });
                $location.path("/voucher");
              })
              .catch(function (error) {
                console.error("Error updating GiamGia:", error);
              });
          }
        });
      };
    }, 2000);
  }
);
