var idgh = localStorage.getItem('idgiohang');
myAppCustom.controller("homeController", function ($http, $scope, $window) {
  $scope.listNewProduct = [];

  function listTop8NewProduct() {
    var url = `http://localhost:8080/api/public/home`;
    $http.get(url).then(function (response) {
      $scope.listNewProduct = response.data;
    });
  }

  listTop8NewProduct();
  function listTopProduct() {
    var url = `http://localhost:8080/api/public/san-pham-ban-chay`;
    $http.get(url).then(function (response) {
      // Lấy chỉ 8 sản phẩm từ dữ liệu trả về
      $scope.listProduct = response.data;
      $scope.listProduct.sort(function(a, b) {
        return b.soLuongDaBan - a.soLuongDaBan;
      });
      $scope.listProduct = $scope.listProduct.slice(0, 8);
    });
  }
  
  listTopProduct();

  $scope.showAllProducts = function () {
    // Call the function to get the entire list
    listTop8NewProduct();
  };
  $scope.showAllProductSelt = function () {
    // Call the function to get the entire list
    listTopProduct();
  };
  $scope.searchProductThuongHieu = function (id) {
    if (!id) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      listTop8NewProduct();
    } else {
      $http
        .get("http://localhost:8080/api/public/detailList", {
          params: { id: id },
        })
        .then(function (response) {
          $scope.listNewProduct = response.data;
        });
    }
  };
  $scope.searchProductThuongHieuSelt = function (id) {
    if (!id) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      listTopProduct();
    } else {
      $http
        .get("http://localhost:8080/api/public/detailListSelt", {
          params: { id: id },
        })
        .then(function (response) {
          $scope.listProduct = response.data;
        });
    }
  };
  $scope.listThuongHieu = [];
  $scope.getListThuongHieu = function () {
    $http
      .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi")
      .then(function (response) {
        $scope.listThuongHieu = response.data;
      });
  };
  $scope.getListThuongHieu();

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
    }
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
        },
      ],
    });
  };
  function loadToTals() {
    if (idgh) {
      // Gọi API và cập nhật giá trị totalAmount

      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/total-amount?idgh=" + idgh
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

  }
  loadToTals();

  function loadQuanTiTy() {
    if (idgh) {
      // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/quantity?idgh=" +
        idgh;
      $http.get(apiURL).then(function (response) {
        $scope.quantity_all = response.data; // Dữ liệu sản phẩm từ API
      });
    }


  }

  loadQuanTiTy();
});
