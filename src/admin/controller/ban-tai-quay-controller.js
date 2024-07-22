myApp.controller(
  "BanTaiQuayController",
  function ($scope, $http, $window, $location, CartService) {
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

    $scope.listCart = []; // show list sản phẩm trong giỏ hàng
    $scope.tongSoLuongSanPham = 0; // tính tổng số lượng sản phẩm có trong giỏ hàng
    $scope.tongTienHang = 0; // tính tổng tiền hàng
    $scope.luuSoLuong = 1; // lấy ra tất cả số lượng của sản phẩm đó
    $scope.soLuongSanPham = 1; // số lượng thêm vào giỏ hàng
    $scope.showInput = false; // show input giao hàng
    $scope.listHoaDonChiTiet = []; // list hóa đơn chi tiết
    $scope.listSanPhamTaiQuay = []; // list sản phẩm tại quầy để thêm vào giỏ hàng
    $scope.listKhachHang = []; // list khách hàng đã tồn tại
    $scope.listTransaction = []; // list transaction của hóa đơn đó
    $scope.codeOrder = ""; // lưu mã hóa đơn lại để truyền cộng thông tin sản phẩm or thanh toán
    $scope.createDate = ""; // lưu ngày tạo lại để truyền cộng thông tin sản phẩm or thanh toán
    $scope.orderDetailCounter = {}; // hiển thị thông tin theo hóa đơn

    $scope.selectedOrder = null;
    $scope.selectOrder = function (hd, kh) {
      $window.localStorage.setItem("idHoaDon", hd);
      $window.localStorage.setItem("idKhach", kh);
      if ($scope.selectedOrder === hd) {
        hd.isSelected = false;
        $scope.selectedOrder = null;
      } else {
        if ($scope.selectedOrder) {
          $scope.selectedOrder.isSelected = false;
        }
        hd.isSelected = true;
        $scope.selectedOrder = hd;
      }
      $window.location.reload();
    };

    var id = $window.localStorage.getItem("idHoaDon");
    var idKhach = $window.localStorage.getItem("idKhach");
    $scope.listHoaDonTaiQuay = []; // show list hóa đơn tại quầy
    // tạo hóa đơn
    setTimeout(() => {
      $scope.createHoaDon = function () {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        var api = "http://localhost:8080/api/v1/don-hang/create";

        if ($scope.listHoaDonTaiQuay.length >= 5) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Tối đa 5 hóa đơn",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Add a class to the message
            },
          });
          return;
        }

        Swal.fire({
          title: "Bạn có muốn tạo hóa đơn?",
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
            $http.post(api, {}, config).then(function (response) {
              $scope.listHoaDonTaiQuay.push(response.data);
              $scope.getListHoaDonTaiQuay();
              $scope.selectOrder(response.data.id, response.data.idKhach);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Tạo thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup",
                },
              }).then(() => {
                // $window.location.reload();
              });
            });
          }
        });
      };
    }, 2000);

    // delete hoadon
    setTimeout(() => {
      $scope.deleteOrder = function (id) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        Swal.fire({
          title: "Xác nhận hủy !",
          text: "Bạn có chắc chắn muốn hủy hóa đơn này ?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            $http
              .put(
                "http://localhost:8080/api/v1/don-hang/remove?id=" + id,
                null,
                config
              )
              .then(function () {
                $scope.removeItem();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Hủy thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                }).then(() => {
                  $window.location.reload();
                });
              });
          }
        });
      };
    }, 2000);

    /**
     * Get all hoa đơn tại quầy
     */
    $scope.pageNumber = 0;
    $scope.pageSize = 5;
    $scope.getListHoaDonTaiQuay = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/don-hang/show?pageNumber=" +
          $scope.pageNumber +
          "&pageSize=" +
          $scope.pageSize,
          config
        )
        .then(function (response) {
          if ($scope.listHoaDonTaiQuay.length < 5) {
            $scope.listHoaDonTaiQuay = response.data;
          }
        });
    };
    $scope.getListHoaDonTaiQuay();

    // tìm kiếm hóa đơn
    $scope.kyHoaDonTaiQuay = "";
    $scope.searchOrder = function (ma) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/don-hang/search/" + ma, config)
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
      if (ma === null || ma === "") {
        $scope.getListHoaDonTaiQuay();
      }
    };

    $scope.lamMoiHoaDon = function () {
      $scope.getListHoaDonTaiQuay();
      $scope.kyHoaDonTaiQuay = "";
    };

    $scope.detailOrderCounterDetail = function () {
      var token = $window.localStorage.getItem("token");
      console.log(token);
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/don-hang/order-counter/" + id,
          config
        )
        .then(function (response) {
          $scope.orderDetailCounter = response.data;
          $window.localStorage.setItem(
            "tienGiamGiaTaiQuay",
            $scope.orderDetailCounter.tienGiamGia
          );
        });
    };

    if (id != null) {
      $scope.detailOrderCounterDetail();
    }

    $scope.showInput = true;

    $scope.toggleInput = function () {
      $scope.showInput = !$scope.showInput;
      $scope.tenNguoiShip = "";
      $scope.soDienThoaiNguoiShip = "";
    };

    $scope.selectedProductQuantity = function (quantity, id) {
      $scope.luuSoLuong = quantity;
      $scope.idSanPhamChiTiet = id;
    };
    // TODO: show sản phẩm trong giỏ hảng
    $scope.pageNumberSpTrongGio = 0;
    $scope.pageSizeSpTrongGio = 100;
    $scope.listCart = [];

    $scope.listSanPhamInCart = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?id=" +
          idKhach +
          "&pageNumber=" +
          $scope.pageNumberSpTrongGio +
          "&pageSize=" +
          $scope.pageSizeSpTrongGio,
          config
        )
        .then(function (response) {
          $scope.listCart = response.data;
          if ($scope.listCart.length < $scope.pageSizeSpTrongGio) {
            $scope.showNextButtonSpInCart = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButtonSpInCart = true; // Hiển thị nút "Next"
          }
        });
    };

    var tienMoi = 0;
    $scope.listSanPhamTienInCart = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet/hien-thi-tien?id=" +
          idKhach,
          config
        )
        .then(function (response) {
          $scope.listCartTien = response.data;
          for (var i = 0; i < $scope.listCartTien.length; i++) {
            $scope.tongTienHang +=
              $scope.listCartTien[i].giaGiam * $scope.listCartTien[i].soLuong;
          }
          tienMoi = $scope.tongTienHang;
          console.log("Bên trong" + $scope.tongTienHang);
          localStorage.setItem("tongTienHangTaiQuay", $scope.tongTienHang);
        });
    };

    var tongTienTaiQuay = localStorage.getItem("tongTienHangTaiQuay");
    console.log("Bên ngoài " + tongTienTaiQuay);
    console.log("Tiền mới" + tienMoi);

    if (id != null) {
      $scope.listSanPhamInCart();
      $scope.listSanPhamTienInCart();
    }

    // TODO: Quay lại trang
    $scope.previousPageSpTrongGio = function () {
      if ($scope.pageNumberSpTrongGio > 0) {
        $scope.pageNumberSpTrongGio--;
        $scope.listSanPhamInCart();
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPageSpTrongGio = function () {
      $scope.pageNumberSpTrongGio++;
      $scope.listSanPhamInCart();
    };

    if (id != null) {
      CartService.setIdCart(id).then(function () { });
      CartService.setIdCart(id).then(function () {
        var idCart = CartService.getIdCart();
        CartService.setIdCartDetail(idCart).then(function () { });
      });
    }

    $scope.themSanPhamCart = function (idCtSp, soLuongSanPham) {
      if (soLuongSanPham == undefined) {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Bạn đã thêm quá số lượng có sẵn",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "small-popup", // Add a class to the message
          },
        });
      } else {
        Swal.fire({
          title: "Bạn có muốn thêm sản phẩm này vào giỏ?",
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
            var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage
            var config = {
              headers: {
                Authorization: "Bearer " + token, // Thêm token vào header Authorization
              },
            };

            var idGioHang = CartService.getIdCart(); // Lấy ID giỏ hàng từ service
            $http
              .post(
                "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham?idGioHang=" +
                idGioHang +
                "&idSanPhamChiTiet=" +
                idCtSp +
                "&soLuong=" +
                soLuongSanPham +
                "&id=" +
                id,
                {},
                config // Truyền thông tin token qua config
              )
              .then(function (response) {
                $scope.listCart.push(response.data);
                $scope.listSanPhamInCart();
                $scope.listSanPhamTienInCart();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm sản phẩm vào giỏ thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                }).then(() => {
                  $window.location.reload();
                });
              });
          }
        });
      }
    };

    // delete sản phẩm trong giỏ hàng
    setTimeout(() => {
      $scope.deleteProduct = function (index) {
        Swal.fire({
          title: "Xác nhận xóa?",
          text: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            let p = $scope.listCart[index];
            var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage
            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .delete(
                "http://localhost:8080/api/gio-hang-chi-tiet/delete_product?id=" +
                p.idGioHang,
                config // Chuyền token vào config
              )
              .then(function () {
                $scope.listCart.splice(index, 1);
                $scope.listSanPhamInCart();
                $scope.listSanPhamTienInCart();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Xóa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  $window.location.reload();
                });
              });
          }
        });
      };
    }, 2000);

    // cập nhập sản phẩm trong giỏ hàng
    setTimeout(() => {
      $scope.updateCart = function (
        idGioHangChiTiet,
        soLuong,
        idSanPhamChiTiet
      ) {
        var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage

        var config = {
          headers: {
            Authorization: "Bearer " + token, // Thêm token vào header Authorization
          },
        };

        $scope.soLuongCoSan = 0;
        $http
          .get(
            "http://localhost:8080/api/gio-hang-chi-tiet/so-luong-san-pham?id=" +
            idSanPhamChiTiet,
            config
          )
          .then(function (response) {
            $scope.soLuongCoSan = response.data;
            console.log($scope.soLuongCoSan);
            if (soLuong > $scope.soLuongCoSan) {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: "Số lượng chuyền vào lớn hơn số lượng tồn!",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Add a class to the message
                },
              }).then(() => {
                $window.location.reload();
              });
            } else {
              var apiURL =
                "http://localhost:8080/api/gio-hang-chi-tiet/update-quantity?idgiohangchitiet=" +
                idGioHangChiTiet +
                "&quantity=" +
                soLuong;

              $http({
                url: apiURL,
                method: "PUT",
                headers: config.headers, // Truyền thông tin token qua headers
                transformResponse: [
                  function () {
                    $scope.listSanPhamInCart();
                    $scope.listSanPhamTienInCart();
                    $window.location.reload();
                  },
                ],
              });
              $window.localStorage.setItem("soLuongCoSan", $scope.soLuongCoSan);
            }
          });
      };
    }, 2000);


  }
);
