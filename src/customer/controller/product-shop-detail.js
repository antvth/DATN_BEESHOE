var idgh = localStorage.getItem("idgiohang");

myAppCustom.controller(
  "sanPhamShopDetailController",
  function ($http, $scope, $routeParams, $window) {

    $scope.checkQuantity = function () {
      // Lấy giá trị nhập vào từ trường số lượng
      var enteredValue = parseInt($scope.soluong);

      // Kiểm tra nếu giá trị là số âm hoặc không phải là số
      if (enteredValue < 1 || isNaN(enteredValue)) {
        // Đặt giá trị về 1 hoặc giá trị hợp lệ khác
        $scope.soluong = 1;
      }
    };
    // Khởi tạo biến số lượng trong $scope
    $scope.soluong = 1;

    $scope.detailProduct = {};
    $scope.detailSizeProduct = [];
    $scope.detailChatLieuProduct = [];
    $scope.detailColorProduct = [];
    $scope.detailMaterialProduct = [];
    $scope.detailQuantity = {};

    var name = $routeParams.name;
    $scope.getDetailProduct = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-name-price-image/" +
          name
        )
        .then(function (response) {
          $scope.detailProduct = response.data;

          // Lấy giá trị idThuongHieu từ $scope.detailProduct
          var idThuongHieu = $scope.detailProduct.idThuongHieu;
          // Lưu giá trị idThuongHieu vào localStorage
          window.localStorage.setItem("idThuongHieu", idThuongHieu);
        });
    };

    $scope.getDetailSizeProduct = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-all-size/" + name
        )
        .then(function (response) {
          $scope.detailSizeProduct = response.data;
        });
    };

    $scope.getDetailMauSacProduct = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-all-mau-sac/" +
          name
        )
        .then(function (response) {
          $scope.detailColorProduct = response.data;
        });
    };

    $scope.getDetailChatLieuProduct = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-all-chat-lieu/" +
          name
        )
        .then(function (response) {
          $scope.detailMaterialProduct = response.data;
        });
    };

    $scope.loadmausac_chatlieu_not_login = [];
    $scope.findMauSacChatLieuBySize = function (idsize) {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/find-by-size/" +
          name +
          "?idsize=" +
          idsize
        )
        .then(function (response) {
          $scope.loadmausac_chatlieu_not_login = response.data;
        });
    };

    $scope.listSizeChatLieuByMauSac = [];
    $scope.findByMauSac = function (id) {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/find-by-mau-sac/" +
          name +
          "?idmausac=" +
          id
        )
        .then(function (response) {
          $scope.listSizeChatLieuByMauSac = response.data;
        });
    };

    $scope.listMauSizeByChatLieu = [];
    $scope.findByChatLieu = function (id) {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/find-by-chat-lieu/" +
          name +
          "?idchatlieu=" +
          id
        )
        .then(function (response) {
          $scope.listMauSizeByChatLieu = response.data;
        });
    };

    $scope.showQuantity = {};
    $scope.quantity = {
      colorId: null,
      sizeId: null,
      chatLieuId: null,
      soluong: null,
      sanPhamChiTietId: null,
    };
    $scope.getQuantity = function () {
      var idMauSac = $scope.quantity.colorId;
      var idSize = $scope.quantity.sizeId;
      var idChatLieu = $scope.quantity.chatLieuId;
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/find-idspct-soluong/" +
          name +
          "?idmausac=" +
          idMauSac +
          "&idsize=" +
          idSize +
          "&idchatlieu=" +
          idChatLieu
        )
        .then(function (response) {
          $scope.showQuantity = response.data;
          $scope.quantity.soluong = response.data.soluong;
          $window.localStorage.setItem("soluongton", $scope.quantity.soluong);
          console.log($window.localStorage.getItem("soluongton"))
          $scope.quantity.sanPhamChiTietId = response.data.id;
        });
    };

    $scope.selectedSize = null;
    $scope.selectSize = function (size) {
      $scope.quantity.sizeId = size.id;
      if (size.isSelected) {
        size.isSelected = false;
      } else {
        $scope.detailSizeProduct.forEach(function (item) {
          item.isSelected = false;
        });
        size.isSelected = true;
        $scope.selectedSize = size;
      }
      if (
        $scope.quantity.sizeId &&
        $scope.quantity.colorId &&
        $scope.quantity.chatLieuId
      ) {
        $scope.getQuantity();
      }
    };

    $scope.selectedColor = null; // Changed from $scope.selectColor to $scope.selectedColor
    $scope.selectColor = function (color) {
      var colorMatchSize = $scope.loadmausac_chatlieu_not_login.some(function (
        item
      ) {
        return item.tenMauSac === color.tenmausac;
      });

      var materialMatchSize = $scope.loadmausac_chatlieu_not_login.some(
        function (item) {
          return item.tenChatLieu === color.tenchatlieu;
        }
      );

      if (!colorMatchSize && !materialMatchSize) {
        alert("không phù hợp với size đã chọn");
        return;
      }

      $scope.quantity.colorId = color.id;
      if (color.isSelected) {
        color.isSelected = false;
      } else {
        $scope.detailColorProduct.forEach(function (item) {
          item.isSelected = false;
        });
        color.isSelected = true;
        $scope.selectedColor = color;
      }
      if (
        $scope.quantity.sizeId &&
        $scope.quantity.colorId &&
        $scope.quantity.chatLieuId
      ) {
        $scope.getQuantity();
      }
    };

    $scope.selectedMaterial = null; // Changed from $scope.selectColor to $scope.selectedColor
    $scope.selectMaterial = function (material) {
      var colorMatchMaterial = $scope.listSizeChatLieuByMauSac.some(function (
        item
      ) {
        return item.tenMauSac === material.tenmausac;
      });

      var sizeMatchMaterial = $scope.loadmausac_chatlieu_not_login.some(
        function (item) {
          return item.size === material.tenchatlieu;
        }
      );

      if (!colorMatchMaterial && !sizeMatchMaterial) {
        alert("không phù hợp với đã chọn");
        return;
      }

      $scope.quantity.chatLieuId = material.id;
      if (material.isSelected) {
        material.isSelected = false;
      } else {
        $scope.detailMaterialProduct.forEach(function (item) {
          item.isSelected = false;
        });
        material.isSelected = true;
        $scope.selectedMaterial = material; // Changed from $scope.selectColor to $scope.selectedColor
        if (
          $scope.quantity.sizeId &&
          $scope.quantity.colorId &&
          $scope.quantity.chatLieuId
        ) {
          $scope.getQuantity();
        }
      }
    };

    // Tạo giỏ hàng mới và lưu idGioHang vào localStorage
    $scope.CreateNewCart = function () {
      $http
        .post("http://localhost:8080/api/gio-hang-not-login/tao-gio-hang")
        .then(function (response) {
          // Lưu idGioHang vào localStorage
          var idGioHang = response.data;
          localStorage.setItem("idgiohang", idGioHang);
        })
        .catch(function (error) {
          // Xử lý lỗi nếu cần
          console.error("Lỗi khi tạo giỏ hàng", error);
        });
    };

// <<<<<<< HEAD
//     // Tạo giỏ hàng cho khách login
//     $scope.CreateNewCartLogin = function () {
//       $http
//         .post("http://localhost:8080/api/gio-hang-not-login/tao-gio-hang-login", config)
//         .then(function (response) {
//           // Lưu idGioHang vào localStorage 
//           var idGioHangLogin = response.data;
//           localStorage.setItem("idgiohanglogin", idGioHangLogin);
//         })
//         .catch(function (error) {
//           // Xử lý lỗi nếu cần
//           console.error("Lỗi khi tạo giỏ hàng", error);
//         });
//     };

// =======
// >>>>>>> 63ba5fafa1c71c6049f7b384dc008e7f7558adf8
    // Thêm sản phẩm vào giỏ hàng
    $scope.addToCart = async function (idSanPhamChiTiet) {

      // Kiểm tra xem đã chọn đủ 3 thuộc tính chưa
      if (!$scope.quantity.sizeId || !$scope.quantity.colorId || !$scope.quantity.chatLieuId) {
        Swal.fire({
          title: "Sorry",
          text: "Vui lòng chọn đủ thuộc tính",
          icon: "error",
          position: "bottom-start", // Đặt vị trí ở góc trái
          toast: true, // Hiển thị thông báo nhỏ
          showConfirmButton: false, // Ẩn nút xác nhận
          timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
        return;
      }

      var idGioHang = localStorage.getItem("idgiohang");
      var soLuong = $scope.soluong;

      console.log(soLuong);
      console.log($window.localStorage.getItem("soluongton"));

      if ($window.localStorage.getItem("soluongton") < soLuong) {
        Swal.fire({
          title: "Sorry",
          text: "Quá số lượng tồn trong kho",
          icon: "error",
          position: "bottom-start", // Đặt vị trí ở góc trái
          toast: true, // Hiển thị thông báo nhỏ
          showConfirmButton: false, // Ẩn nút xác nhận
          timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
        return;
      }

      if (soLuong <= 0) {
        Swal.fire({
          title: "Sorry",
          text: "Số lượng phải lớn hơn 0",
          icon: "error",
          position: "bottom-start", // Đặt vị trí ở góc trái
          toast: true, // Hiển thị thông báo nhỏ
          showConfirmButton: false, // Ẩn nút xác nhận
          timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
        return;
      }

      if (!idGioHang) {
        await $scope.CreateNewCart();
      } else {
        try {
          var idGioHang = localStorage.getItem("idgiohang");
          await $http.post(
            `http://localhost:8080/api/gio-hang-chi-tiet-not-login/them-san-pham?idGioHang=${idGioHang}&idSanPhamChiTiet=${idSanPhamChiTiet}&soLuong=${soLuong}`
          );
          loadCart();
          loadToTals();
          loadQuanTiTy();
          $window.location.reload();
        } catch (error) {
          // Xử lý lỗi nếu cần
        }
      }

      // localStorage.removeItem("idgiohang");
    };

    $scope.getDetailProduct();
    $scope.getDetailSizeProduct();
    $scope.getDetailMauSacProduct();
    $scope.getDetailChatLieuProduct();

    function loadRelatedProducts() {
      var idThuongHieu = window.localStorage.getItem("idThuongHieu"); // Thay thế bằng id thương hiệu tương ứng
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-sp-lien-quan?idthuonghieu=" +
          idThuongHieu
        )
        .then(function (response) {
          $scope.relatedProducts = response.data;
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API: " + error);
        });
    }

    loadRelatedProducts();
    function loadCart() {
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
    }
    loadCart();
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
            Swal.fire({
              title: "Success",
              text: "Xóa thành công",
              icon: "success",
              position: "bottom-start", // Đặt vị trí ở góc trái
              toast: true, // Hiển thị thông báo nhỏ
              showConfirmButton: false, // Ẩn nút xác nhận
              timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            });
            loadCart();
            loadToTals();
            loadNameAndPrice();
            loadQuanTiTy();
          },
        ],
      });
    };
    loadQuanTiTy();
    function loadToTals() {
      // Gọi API và cập nhật giá trị totalAmount

      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/total-amount?idgh=" +
          idgh
        )
        .then(function (response) {
          // Lấy giá trị tổng tiền từ phản hồi API
          $scope.totalAmount = response.data[0].tongSoTien;
          $window.localStorage.setItem("totalAmount", $scope.totalAmount);
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API: " + error);
        });
    }
    loadToTals();

    function loadQuanTiTy() {
      // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/quantity?idgh=" +
        idgh;

      $http.get(apiURL).then(function (response) {
        $scope.quantity_all = response.data; // Dữ liệu sản phẩm từ API
      });
    }

    loadQuanTiTy();
    $scope.changeQuantity = function(increment) {
      $scope.soluong += increment;
      if ($scope.soluong < 1) {
        $scope.soluong = 1;
      }
      $scope.checkQuantity();
    };
    
  });
