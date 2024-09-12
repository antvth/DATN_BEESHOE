var idgh = localStorage.getItem("idgiohang");
myAppCustom.controller(
  "CartController",
  function ($scope, $http, $window, $location, $route, $routeParams) {
    function loadToTals() {
      if (!idgh) {
        console.log("No cart!!!");
        return;
      }

      // Gọi API và cập nhật giá trị totalAmount
      $http.get("http://localhost:8080/api/gio-hang-chi-tiet-not-login/total-amount?idgh=" + idgh)
        .then(function (response) {
          if (!response.data || !response.data[0]) {
            console.error("Invalid API response");
            return;
          }

          // Lấy giá trị tổng tiền từ phản hồi API
          $scope.totalAmount = parseFloat(response.data[0].tongSoTien);
          $window.localStorage.setItem("totalAmount", $scope.totalAmount);

          var totalAmount = parseFloat($window.localStorage.getItem("totalAmount"));
          if (isNaN(totalAmount)) {
            console.error("Invalid total amount");
            return;
          }

          $scope.giamGiaVoucher = 0;

          // Lấy giá trị từ localStorage
          var hinhThucGiam = $window.localStorage.getItem("hinhthucgiam");
          var giatrigiam = parseFloat($window.localStorage.getItem("giatrigiam"));

          if (isNaN(giatrigiam)) {
            console.error("Invalid discount value");
            return;
          }

          // Kiểm tra hình thức giảm giá
          if (hinhThucGiam === "1") {
            // Giảm giá theo tỷ lệ %
            console.log("Giảm giá theo tỷ lệ %");
            $scope.giamGiaVoucher = (totalAmount * giatrigiam) / 100;
          } else if (hinhThucGiam === "2") {
            // Giảm giá theo giá trị VNĐ
            console.log("Giảm giá theo giá trị VNĐ");
            $scope.giamGiaVoucher = giatrigiam;
          } else {
            console.error("Unknown discount type");
            return;
          }

          // Tính tổng cộng dựa trên giá trị giảm giá
          $scope.tongCong = totalAmount - $scope.giamGiaVoucher;

          // Định dạng lại tổng tiền và tổng cộng
          $scope.totalAmount = totalAmount.toFixed(0);
          $scope.tongCong = $scope.tongCong.toFixed(0);
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API: " + error);
        });
    }


    loadToTals();
    // Hàm thay đổi số lượng sản phẩm
    $scope.changeQuantity = function (product, change) {
      if (change === "increase") {
        product.soluong++;
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else if (change === "decrease" && product.soluong > 1) {
        product.soluong--;
        setTimeout(function () {
          location.reload();
        }, 1000);
      }
      // Gọi API để cập nhật số lượng
      console.log(product.id);
      console.log(product.soluong);
      updateQuantity(product.id, product.soluong);
    };

    // Hàm gọi API cập nhật số lượng
    function updateQuantity(productId, newQuantity) {
      if (idgh) {
        var apiURL =
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/update-quantity?idgiohangchitiet=" +
          productId +
          "&quantity=" +
          newQuantity;

        $http({
          url: apiURL,
          method: "PUT",
          transformResponse: [
            function () {
              $scope.getCartTotal();
              $scope.voucherBest();
              $scope.checkAndApplyBestVoucher();
              loadCart();
              loadToTals();
              loadNameAndPrice();
              loadQuanTiTy();
              $scope.checkAndRemoveVoucherIfNeeded();
            },
          ],
        });
      } else {
        console.log("No cart!!!");
      }
    }

    //delete product
    $scope.deleteProduct = function (productId) {
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-san-pham?idgiohangchitiet=" +
        productId;

      $http({
        url: apiURL,
        method: "DELETE",
        transformResponse: [
          function () {
            $scope.getCartTotal();
            $scope.voucherBest();
            $scope.checkAndApplyBestVoucher();
            loadCart();
            loadToTals();
            loadNameAndPrice();
            loadQuanTiTy();
            $scope.checkAndRemoveVoucherIfNeeded();
            location.reload();
          },
        ],
      });
    };

    //delete all product
    $scope.clearCart = function () {
      if (idgh) {
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
            if (idgh) {
              var apiURL =
                "http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-tat-ca-san-pham?idGioHang=" +
                idgh;

              $http({
                url: apiURL,
                method: "DELETE",
                transformResponse: [
                  function () {
                    Swal.fire({
                      title: "",
                      text: "Xóa thành công",
                      icon: "success",
                      position: "top-end",
                      toast: true,
                      showConfirmButton: false,
                      timer: 1500,
                    });

                    localStorage.removeItem("idgiohang");
                    localStorage.removeItem("idVoucher");
                    localStorage.removeItem("giatrigiam");
                    localStorage.removeItem("hinhthucgiam");
                    localStorage.removeItem("giatritoithieudonhang");
                    localStorage.removeItem("maVoucher");
                    localStorage.removeItem("totalAmount");
                    localStorage.removeItem("listCart");
                    loadCart();
                    loadToTals();
                    loadNameAndPrice();
                    loadQuanTiTy();
                  },
                ],
              });
            } else {
              console.log("Không có giỏ hàng để xóa.");
            }
          }
        });
        setTimeout(function () {
          location.reload();
        }, 2500);
      } else {
        console.log("No cart!!!");
      }
    };

    function loadCart() {
      if (idgh) {
        // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
        var apiURL =
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/hien-thi?idgh=" +
          idgh;

        $http.get(apiURL).then(function (response) {
          $scope.products = response.data; // Dữ liệu sản phẩm từ API
          $window.localStorage.setItem(
            "listCart",
            $scope.products.map((item) => item.id)
          );
        });
        if (idgh) {
          var listCartGet = $window.localStorage.getItem("listCart");
          console.log("listCartGet" + listCartGet);
          // Kiểm tra nếu giỏ hàng trống, thực hiện xóa local storage
          if (listCartGet.length === 0) {
            localStorage.removeItem("idgiohang");
            localStorage.removeItem("idVoucher");
            localStorage.removeItem("giatrigiam");
            localStorage.removeItem("hinhthucgiam");
            localStorage.removeItem("maVoucher");
            localStorage.removeItem("totalAmount");
            localStorage.removeItem("listCart");
          }
        } else {
          console.log("Không có giỏ hàng để xóa.");
        }
      } else {
        console.log("No cart!!!");
      }
    }
    loadCart();
    // Gọi API và cập nhật danh sách sản phẩm và tổng tiền
    function loadNameAndPrice() {
      if (idgh) {
        $http
          .get(
            "http://localhost:8080/api/gio-hang-chi-tiet-not-login/name-quantity?idgh=" +
            idgh
          )
          .then(function (response) {
            $scope.items = response.data;

            // Tính tổng tiền sản phẩm
            $scope.totalAmount = 0;
            for (var i = 0; i < $scope.items.length; i++) {
              $scope.totalAmount += parseFloat($scope.items[i].tongTien);
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi gọi API: " + error);
          });
      } else {
        console.log("No cart!!!");
      }
    }
    loadNameAndPrice();
    // Khai báo biến để lưu các giá trị đã binding
    $scope.hoTen = "";
    $scope.soDienThoai = "";
    $scope.email = "";
    $scope.diaChi = "";
    $scope.tongTien = 0; // Để tránh lỗi nếu không có giá trị tổng tiền
    $scope.tienKhachTra = 0; // Để tránh lỗi nếu không có giá trị tiền khách trả
    $scope.gioHangChiTietList = $scope.gioHangChiTietList;

    if (idgh) {
      var idGioHangChiTiet = $window.localStorage.getItem("listCart");
      var gioHangChiTietList = idGioHangChiTiet.split(",");
    }
    // Lấy giá trị tổng tiền từ localStorage
    var totalAmount = parseFloat($window.localStorage.getItem("totalAmount"));

    // Kiểm tra xem có token đăng nhập hay không
    var token = $window.localStorage.getItem("token-customer");

    if (token) {
      // Nếu có token, gọi API để lấy thông tin khách hàng
      var apiEndpoint = "http://localhost:8080/api/v1/account/profile";
      var apiAddress = "http://localhost:8080/api/v1/account/dia-chi";
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http.get(apiEndpoint, config).then(
        function (response) {
          console.log(response.data);
          // Lấy thông tin từ server và gán vào các biến $scope
          $scope.hoTen = response.data.hoTen;
          $scope.email = response.data.email;
          $scope.soDienThoai = response.data.soDienThoai;

          // Gọi API địa chỉ
          $http.get(apiAddress, config).then(
            function (addressResponse) {
              // Lọc các địa chỉ có trạng thái là 1
              $scope.filteredAddresses = addressResponse.data.filter(function (
                address
              ) {
                return address.trangThai === "1";
              });

              // Lấy địa chỉ đầu tiên từ danh sách đã lọc và gán vào $scope.diaChi
              $scope.diaChi =
                $scope.filteredAddresses.length > 0
                  ? $scope.filteredAddresses[0].diaChi
                  : "";
            },
            function (addressError) {
              console.error("Lỗi khi gọi API địa chỉ: " + addressError);
            }
          );
        },
        function (error) {
          console.error("Lỗi khi gọi API thông tin cá nhân: " + error);
        }
      );
    }
    var idGiamGiaVoucher = $window.localStorage.getItem("idVoucher");

    // Kiểm tra xem có voucher được chọn không
    if (idGiamGiaVoucher === null || idGiamGiaVoucher === undefined) {
      // Nếu không có voucher, có thể đặt idGiamGiaVoucher thành null hoặc giá trị mặc định
      idGiamGiaVoucher = "beca564d-5d14-4d0c-82cd-75b8db667ced"; // hoặc giá trị mặc định
    }
    //THANH TOAN LOGIC

    $scope.giamGiaVoucher = 0;
    // Lấy giá trị từ localStorage
    var hinhThucGiam = $window.localStorage.getItem("hinhthucgiam");
    var giatrigiam = parseFloat($window.localStorage.getItem("giatrigiam"));

    // Kiểm tra hình thức giảm giá
    if (hinhThucGiam === "1") {
      // Giảm giá theo tỷ lệ %
      console.log("Giảm giá theo tỷ lệ %");
      $scope.giamGiaVoucher = (totalAmount * giatrigiam) / 100;
    }
    if (hinhThucGiam === "2") {
      // Giảm giá theo giá trị VNĐ
      console.log("Giảm giá theo giá trị VNĐ");
      $scope.giamGiaVoucher = giatrigiam;
    }

    if (!$scope.giamGiaVoucher) {
      $scope.tongCong = totalAmount;
    }
    if ($scope.giamGiaVoucher) {
      // Tính tổng cộng dựa trên giá trị giảm giá
      $scope.tongCong = totalAmount - $scope.giamGiaVoucher;
    }

    // validation here
    $scope.isHoTenValid = true;
    $scope.isDiaChiValid = true;
    $scope.isSoDienThoaiValid = true;
    $scope.isEmailValid = true;

    $scope.isSoDienThoaiFormat = true;
    $scope.isEmailFormat = true;

    function validateSoDienThoaiFormat(soDienThoai) {
      // Sử dụng biểu thức chính quy để kiểm tra định dạng số điện thoại Việt Nam
      var phoneRegex = /^(0[2-9]{1}\d{8,9})$/;
      return phoneRegex.test(soDienThoai);
    }

    function validateEmailFormat(email) {
      // Sử dụng biểu thức chính quy để kiểm tra định dạng email
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    //check out
    $scope.thanhToan = function () {
      // Kiểm tra xem các trường thông tin cần thiết đã được nhập đầy đủ không
      $scope.isHoTenValid = !!$scope.hoTen;
      $scope.isSoDienThoaiValid = !!$scope.soDienThoai;
      $scope.isEmailValid = !!$scope.email;
      $scope.isDiaChiValid = !!$scope.diaChi;
      if ($scope.soDienThoai) {
        $scope.isSoDienThoaiFormat = validateSoDienThoaiFormat(
          $scope.soDienThoai
        );
      }
      if ($scope.email) {
        $scope.isEmailFormat = validateEmailFormat($scope.email);
      }

      if (
        !$scope.isHoTenValid ||
        !$scope.isSoDienThoaiValid ||
        !$scope.isEmailValid ||
        !$scope.isDiaChiValid
      ) {
        Swal.fire({
          title: "Warning",
          text: "Vui lòng điền đủ thông tin",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      // Hiển thị hộp thoại xác nhận của SweetAlert2
      Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc chắn muốn đặt đơn hàng?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          if (idgh) {
            // Nếu người dùng đồng ý, tiếp tục với quá trình xử lý
            var data = {
              hoTen: $scope.hoTen,
              soDienThoai: $scope.soDienThoai,
              email: $scope.email,
              diaChi: $scope.diaChi,
              tienKhachTra: $scope.tienKhachTra,
              gioHangChiTietList: gioHangChiTietList,
              idGiamGia: idGiamGiaVoucher,
            };

            data.tongTien = $scope.tongCong;
            data.tienGiamGia = $scope.giamGiaVoucher;

            if (token) {
              $http
                .post(
                  "http://localhost:8080/api/checkout-not-login/thanh-toan-login",
                  data,
                  config
                )
                .then(
                  function (response) {
                    console.log("idHoaDon" + response.data);
                    $window.localStorage.setItem(
                      "idHoaDonLogin",
                      response.data
                    );
                    // Xử lý response nếu cần thiết
                    localStorage.removeItem("idgiohang");
                    localStorage.removeItem("idVoucher");
                    localStorage.removeItem("giatrigiam");
                    localStorage.removeItem("hinhthucgiam");
                    localStorage.removeItem("maVoucher");
                    localStorage.removeItem("totalAmount");
                    localStorage.removeItem("listCart");
                    localStorage.removeItem("giatritoithieudonhang");
                    Swal.fire({
                      title: "",
                      text: "Thanh toán thành công",
                      icon: "success",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    // Chuyển hướng đến trang "thank-you"
                    $location.path("/thank-you");
                    setTimeout(function () { location.reload(); })

                  },
                  function (error) {
                    console.log(error);
                  }
                );
            } else {
              // Gửi dữ liệu đến máy chủ
              $http({
                method: "POST",
                url: "http://localhost:8080/api/checkout-not-login/thanh-toan",
                data: data,
              }).then(
                function (response) {
                  // Xử lý response nếu cần thiết
                  localStorage.removeItem("idgiohang");
                  localStorage.removeItem("idVoucher");
                  localStorage.removeItem("giatrigiam");
                  localStorage.removeItem("hinhthucgiam");
                  localStorage.removeItem("maVoucher");
                  localStorage.removeItem("totalAmount");
                  localStorage.removeItem("listCart");
                  Swal.fire({
                    title: "Success",
                    text: "Thanh toán thành công",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  // Chuyển hướng đến trang "thank-you"
                  $location.path("/thank-you2");
                  setTimeout(function () { location.reload(); })

                },
                function (error) {
                  console.log(error);
                }
              );
            }
          } else if (!idgh) {
            Swal.fire("Giỏ hàng chưa có sản phẩm !", "", "error");
          }
        } else {
          Swal.fire("Đã hủy đặt đơn hàng", "", "error");
        }
      });
    }; //close check out

    //check out
    $scope.thanhToanVnPay = function () {
      // Kiểm tra thông tin cần thiết
      $scope.isHoTenValid = !!$scope.hoTen;
      $scope.isSoDienThoaiValid = !!$scope.soDienThoai;
      $scope.isEmailValid = !!$scope.email;
      $scope.isDiaChiValid = !!$scope.diaChi;
    
      if ($scope.soDienThoai) {
        $scope.isSoDienThoaiFormat = validateSoDienThoaiFormat($scope.soDienThoai);
      }
      if ($scope.email) {
        $scope.isEmailFormat = validateEmailFormat($scope.email);
      }
    
      if (
        !$scope.isHoTenValid ||
        !$scope.isSoDienThoaiValid ||
        !$scope.isEmailValid ||
        !$scope.isDiaChiValid
      ) {
        Swal.fire({
          title: "Warning",
          text: "Vui lòng điền đủ thông tin",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
    
      // Hiển thị hộp thoại xác nhận
      Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc chắn muốn đặt đơn hàng?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          if (idgh) {
            var data = {
              hoTen: $scope.hoTen,
              soDienThoai: $scope.soDienThoai,
              email: $scope.email,
              diaChi: $scope.diaChi,
              tienKhachTra: $scope.tienKhachTra,
              gioHangChiTietList: gioHangChiTietList,
              idGiamGia: idGiamGiaVoucher,
            };
    
            data.tongTien = $scope.tongCong;
            data.tienGiamGia = $scope.giamGiaVoucher;
    
            // Xác thực và gửi yêu cầu
            var apiUrl = token
              ? "http://localhost:8080/api/checkout-not-login/thanh-toan-login"
              : "http://localhost:8080/api/checkout-not-login/thanh-toan";
    
            $http({
              method: "POST",
              url: apiUrl,
              data: data,
              headers: token ? { Authorization: "Bearer " + token } : {}
            }).then(
              function (response) {
                if (token) {
                  $window.localStorage.setItem("idHoaDonLogin", response.data);
                }
                localStorage.removeItem("idgiohang");
                localStorage.removeItem("idVoucher");
                localStorage.removeItem("giatrigiam");
                localStorage.removeItem("hinhthucgiam");
                localStorage.removeItem("maVoucher");
                localStorage.removeItem("totalAmount");
                localStorage.removeItem("listCart");
                localStorage.removeItem("giatritoithieudonhang");
    
                // Tiến hành thanh toán
                $scope.Vnpay(data.tongTien);
              },
              function (error) {
                console.log(error);
              }
            );
          } else {
            Swal.fire("Giỏ hàng chưa có sản phẩm !", "", "error");
          }
        } else {
          Swal.fire("Đã hủy đặt đơn hàng", "", "error");
        }
      });
    };
    

    // voucher here
    $scope.vouchers = [];
    // Gửi yêu cầu API và xử lý kết quả
    $scope.voucher = function () {
      $http
        .get("http://localhost:8080/api/v1/voucher-login/show")
        .then(function (response) {
          $scope.vouchers = response.data;
          // Đặt trạng thái áp dụng cho mỗi voucher
          $scope.vouchers.forEach(function (voucher) {
            voucher.isApplied = false;
          });
        });
    };
    $scope.voucher();
    // Khi áp dụng mã giảm giá
    $scope.voucherId = function (
      id,
      giatrigiam,
      hinhthucgiam,
      magiamgia,
      giatritoithieudonhang
    ) {
      //Get tổng giá trị
      var tongtienIF = parseFloat($window.localStorage.getItem("totalAmount"));

      var giatritoithieudonhang = parseFloat(giatritoithieudonhang);

      if (tongtienIF >= giatritoithieudonhang) {
        $window.localStorage.setItem("idVoucher", id);
        console.log($window.localStorage.getItem("idVoucher"));
        $window.localStorage.setItem("giatrigiam", giatrigiam);
        console.log($window.localStorage.getItem("giatrigiam"));
        $window.localStorage.setItem("hinhthucgiam", hinhthucgiam);
        console.log($window.localStorage.getItem("hinhthucgiam"));
        $window.localStorage.setItem("maVoucher", magiamgia);
        console.log($window.localStorage.getItem("maVoucher"));
        $window.localStorage.setItem(
          "giatritoithieudonhang",
          giatritoithieudonhang
        );

        // Lấy giá trị từ localStorage
        $scope.magiamgia = $window.localStorage.getItem("maVoucher");
        var idGiamGiaVoucher = $window.localStorage.getItem("idVoucher");
        var hinhThucGiam = $window.localStorage.getItem("hinhthucgiam");
        var giatrigiam = parseFloat($window.localStorage.getItem("giatrigiam"));
        // Kiểm tra hình thức giảm giá
        if (hinhThucGiam === "1") {
          // Giảm giá theo tỷ lệ %
          console.log("Giảm giá theo tỷ lệ %");
          $scope.giamGiaVoucher = (totalAmount * giatrigiam) / 100;
        } else if (hinhThucGiam === "2") {
          // Giảm giá theo giá trị VNĐ
          console.log("Giảm giá theo giá trị VNĐ");
          $scope.giamGiaVoucher = giatrigiam;
        }

        // Tính tổng cộng dựa trên giá trị giảm giá
        $scope.tongCong = totalAmount - $scope.giamGiaVoucher;
        Swal.fire({
          title: "Thành công",
          text: "Đã áp dụng voucher",
          icon: "success",
          position: "top-end", // Đặt vị trí ở góc trái
          toast: true, // Hiển thị thông báo nhỏ
          showConfirmButton: false, // Ẩn nút xác nhận
          timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
      } else {
        Swal.fire({
          title: "Sorry",
          text: "Giá trị đơn hàng chưa đủ ",
          icon: "error",
          position: "top-end", // Đặt vị trí ở góc trái
          toast: true, // Hiển thị thông báo nhỏ
          showConfirmButton: false, // Ẩn nút xác nhận
          timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
      }
      // Cập nhật trạng thái isApplied của voucher đã áp dụng
      $scope.vouchers.forEach(function (voucher) {
        if (voucher.mavoucher === $scope.magiamgia) {
          voucher.isApplied = true;
        } else {
          voucher.isApplied = false;

        }
      });
    };

    // Gọi hàm để hiển thị thông tin trong ô input
    $scope.magiamgia = $window.localStorage.getItem("maVoucher");
    function loadQuanTiTy() {
      if (idgh) {
        // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
        var apiURL =
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/quantity?idgh=" +
          idgh;

        $http.get(apiURL).then(function (response) {
          $scope.quantity_all = response.data; // Dữ liệu sản phẩm từ API
        });
      } else {
        console.log("No cart!!!");
      }
    }
    loadQuanTiTy();

    //xử lý tự động add voucher
    // Hàm để lấy giá trị đơn hàng hiện tại
    $scope.getCartTotal = function () {
      // Thực hiện logic để lấy giá trị đơn hàng từ giỏ hàng của bạn
      // Ở đây, mình sẽ giả sử giá trị đơn hàng đã lưu trong $window.localStorage
      return parseFloat($window.localStorage.getItem("totalAmount")) || 0;
    };
    // Hàm để kiểm tra và áp dụng voucher một cách tự động
    $scope.checkAndApplyBestVoucher = function () {
      var currentCartTotal = $scope.getCartTotal();

      // Lặp qua danh sách voucher để tìm voucher phù hợp
      var bestVoucher = null;
      $scope.vouchers.forEach(function (voucher) {
        if (voucher.giatritoithieudonhang <= currentCartTotal) {
          var discountValue =
            voucher.hinhthucgiam === 1
              ? (currentCartTotal * voucher.giatrigiam) / 100 // Giảm theo phần trăm
              : voucher.giatrigiam; // Giảm theo giá trị

          // Kiểm tra xem voucher này có giảm nhiều hơn voucher hiện tại hay không
          if (!bestVoucher || discountValue > bestVoucher.discountValue) {
            bestVoucher = {
              voucher: voucher,
              discountValue: discountValue,
            };
          }
        }
      });

      // Nếu có voucher phù hợp, áp dụng tự động
      if (bestVoucher) {
        $scope.voucherId(
          bestVoucher.voucher.id,
          bestVoucher.voucher.giatrigiam,
          bestVoucher.voucher.hinhthucgiam,
          bestVoucher.voucher.mavoucher,
          bestVoucher.voucher.giatritoithieudonhang
        );
      }
    };

    // Gọi hàm để lấy danh sách voucher từ API và kiểm tra áp dụng tự động
    $scope.vouchers = [];
    $scope.voucherBest = function () {
      $http
        .get("http://localhost:8080/api/v1/voucher-login/show")
        .then(function (response) {
          $scope.vouchers = response.data;
          $scope.magiamgia = $window.localStorage.getItem("maVoucher");
          // Sau khi lấy danh sách voucher, kiểm tra và áp dụng tự động
          $scope.checkAndApplyBestVoucher();
        });
    };

    // Gọi hàm để lấy danh sách voucher
    $scope.voucherBest();

    // Hàm để xóa bỏ voucher khỏi danh sách
    $scope.checkAndRemoveVoucherIfNeeded = function () {
      var currentCartTotal = $scope.getCartTotal();
      // Kiểm tra xem có voucher đang áp dụng không
      var appliedVoucherId = $window.localStorage.getItem("idVoucher");
      $scope.magiamgia = $window.localStorage.getItem("maVoucher");
      if (appliedVoucherId) {
        // Lấy thông tin của voucher đang áp dụng từ localStorage
        var appliedVoucher = {
          id: appliedVoucherId,
          giatrigiam: $window.localStorage.getItem("giatrigiam"),
          hinhthucgiam: $window.localStorage.getItem("hinhthucgiam"),
          mavoucher: $window.localStorage.getItem("maVoucher"),
          giatritoithieudonhang: parseFloat(
            $window.localStorage.getItem("giatritoithieudonhang")
          ),
        };
        // Nếu giá trị đơn hàng không đủ với voucher đang áp dụng
        if (currentCartTotal < appliedVoucher.giatritoithieudonhang) {
          // Xóa bỏ voucher
          $window.localStorage.removeItem("idVoucher");
          $window.localStorage.removeItem("giatrigiam");
          $window.localStorage.removeItem("hinhthucgiam");
          $window.localStorage.removeItem("maVoucher");
          // Cập nhật giá trị đơn hàng
          $scope.tongCong = currentCartTotal;
          $scope.magiamgia = $window.localStorage.getItem("maVoucher");
          // Hiển thị thông báo hoặc thực hiện các công việc khác nếu cần thiết
          console.log(
            "Giá trị đơn hàng không đủ với voucher, voucher đã được xóa."
          );
        }
      }
    };
    $scope.checkAndRemoveVoucherIfNeeded();

    $scope.Vnpay = function (amountParam) {
      $http
        .post(
          "http://localhost:8080/api/v1/payment/online/vn_pay?amountParam=" +
          amountParam
        )
        .then(function (response) {
          $window.location.href = response.data.url;
        });
    };

    $scope.queryParams = $location.search();

    // Lấy giá trị của tham số 'vnp_Amount'
    $scope.amountParamValue = $scope.queryParams.vnp_Amount;
    $scope.maGiaoDinh = $scope.queryParams.vnp_TxnRef;
    $scope.tienCuoiCungVnPay = $scope.amountParamValue / 100;

    var idHoaDonLogin = $window.localStorage.getItem("idHoaDonLogin");

    // TODO: thanh toán chuyển khoản
    $scope.createTransactionVnpayLogin = function () {
      $http
        .post(
          "http://localhost:8080/api/checkout-not-login/vn-pay?id=" +
          idHoaDonLogin +
          "&maGiaoDinh=" +
          $scope.maGiaoDinh +
          "&vnp_Amount=" +
          $scope.tienCuoiCungVnPay
        )
        .then(function (response) {
          $scope.listTransaction.push(response.data);
        });
    };

    console.log("Đây là id hóa đơn " + idHoaDonLogin);

    var transactionVnpayCalled = false;
    if (
      $scope.maGiaoDinh != null &&
      $scope.tienCuoiCungVnPay != null &&
      !transactionVnpayCalled
    ) {
      console.log("Có vào đây không");
      $scope.createTransactionVnpayLogin();
      transactionVnpayCalled = true;
      $window.localStorage.removeItem("idHoaDonLogin");
    }
    // $scope.reloadPage1 = function() {
    //   // Đặt timeout cho việc reload trang sau 1000ms (1 giây)
    //   $location.path("/home");
    //   setTimeout(function() { location.reload();})

    // }
    // function reloadPage2() {
    //   // Đặt timeout cho việc reload trang sau 1000ms (1 giây)
    //   $location.path("/don-hang");
    //   setTimeout(function() { location.reload();})

    // }
  }
);

