var idgh = localStorage.getItem("idgiohang");
myAppCustom.controller(
  "sanPhamShopController",
  function ($http, $scope, $window) {
    var token = $window.localStorage.getItem("token-customer");
    $scope.listSanPhamShop = [];
    $scope.listThuongHieu = [];
    $scope.listDanhMuc = [];
    $scope.listSize = [];

    $scope.pageNumber = 0;
    $scope.pageSize = 12;

    function listSanPhamGiamGia() {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show?pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize
        )
        .then(function (response) {
          $scope.listSanPhamShop = response.data;
          if ($scope.listSanPhamShop.length < $scope.pageSize) {
            $scope.showNextButton = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButton = true; // Hiển thị nút "Next"
          }
        });
    }

    // Initial load
    listSanPhamGiamGia();

    // TODO: Quay lại trang
    $scope.previous = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        if ($scope.isLoc != false) {
          $scope.searchProductDanhMuc();
        } else if ($scope.isLocKieuDe != false) {
          $scope.searchProductKieuDe();
        } else if ($scope.isLocXuatXu != false) {
          $scope.searchProductXuatXu();
        } else if ($scope.isLocBrand != false) {
          $scope.searchProductThuongHieu();
        } else {
          listSanPhamGiamGia();
        }
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPage = function () {
      $scope.pageNumber++;
      if ($scope.isLoc) {
        $scope.searchProductDanhMuc();
      } else if ($scope.isLocKieuDe) {
        $scope.searchProductKieuDe();
      } else if ($scope.isLocXuatXu) {
        $scope.searchProductXuatXu();
      } else if ($scope.isLocBrand) {
        $scope.searchProductThuongHieu();
      } else {
        listSanPhamGiamGia();
      }
    };

    $scope.selectedCategoryId = null;

    $scope.locDanhMuc = "";
    $scope.isLoc = false;
    $scope.searchProductDanhMuc = function () {
      if ($scope.locDanhMuc == "") {
        $scope.isLoc = false;
        listSanPhamGiamGia();
      } else {
        $scope.isLoc = true;
        $scope.selectedCategoryId = $scope.locDanhMuc;
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-giam-gia/filter-category?pageNumber=" +
              $scope.pageNumber +
              "&pageSize=" +
              $scope.pageSize +
              "&id=" +
              $scope.locDanhMuc
          )
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
            if ($scope.listSanPhamShop.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    $scope.selectedBrandId = null;

    $scope.locBrand = "";
    $scope.isLocBrand = false;
    $scope.searchProductThuongHieu = function (id) {
      if ($scope.locBrand == "") {
        $scope.isLocBrand = false;
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        listSanPhamGiamGia();
      } else {
        $scope.selectedBrandId = id; // Đặt giá trị cho selectedBrandId
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-giam-gia/filter-brand?pageNumber=" +
              $scope.pageNumber +
              "&pageSize=" +
              $scope.pageSize +
              "&id=" +
              $scope.locBrand
          )
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
            if ($scope.listSanPhamShop.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    $scope.selectedKieuDeId = null;
    $scope.selectedXuatXuId = null;
    $scope.locKieuDe = "";
    $scope.isLocKieuDe = false;
    $scope.searchProductKieuDe = function () {
      if ($scope.locKieuDe == "") {
        $scope.isLocKieuDe = false;
        listSanPhamGiamGia();
      } else {
        $scope.isLocKieuDe = true;
        $scope.selectedKieuDeId = $scope.locKieuDe;
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-giam-gia/filter-sole?pageNumber=" +
              $scope.pageNumber +
              "&pageSize=" +
              $scope.pageSize +
              "&id=" +
              $scope.locKieuDe
          )
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
            if ($scope.listSanPhamShop.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    $scope.isLocXuatXu = false;
    $scope.locXuatXu = "";
    $scope.searchProductXuatXu = function (id) {
      if ($scope.locXuatXu == "") {
        $scope.isLocXuatXu = false;
        listSanPhamGiamGia();
      } else {
        $scope.isLocXuatXu = true;
        $scope.selectedXuatXuId = id;
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-giam-gia/filter-origin?pageNumber=" +
              $scope.pageNumber +
              "&pageSize=" +
              $scope.pageSize +
              "&id=" +
              $scope.locXuatXu
          )
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
            if ($scope.listSanPhamShop.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };
    $scope.searchProductKey = function () {
      var key = $scope.tenSanPham;

      if (!key) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.listSanPhamGiamGia();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-giam-gia/searchString_bykey?pageNumber=" +
              $scope.pageNumber +
              "&pageSize=" +
              $scope.pageSize +
              "&key=" +
              key
          )
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
          });
      }
    };

    $scope.searchProductByPriceRange = function () {
      var selectedRange = $scope.selectedPriceRange;
      var key1, key2;

      // Tách giá trị của option thành khoảng giá key1 và key2
      if (selectedRange) {
        var rangeValues = selectedRange.split("-");
        key1 = rangeValues[0];
        key2 = rangeValues.length > 1 ? rangeValues[1] : null;
      }

      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/searchMoneybykey?pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize +
            "&key1=" +
            key1 +
            "&key2=" +
            key2
        )
        .then(function (response) {
          $scope.listSanPhamShop = response.data;
        });
    };

    $scope.getlistCategory = function () {
      $http
        .get("http://localhost:8080/api/v1/thuoc-tinh/show-danh-muc")
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    };
    $scope.getlistCategory();

    $scope.listKieuDe = [];
    $scope.getListKieuDe = function () {
      $http
        .get("http://localhost:8080/api/v1/thuoc-tinh/show-kieu-de")
        .then(function (response) {
          $scope.listKieuDe = response.data;
        });
    };
    $scope.getListKieuDe();

    // TODO: Lấy ra tất cả bản ghi của thương hiệu
    $scope.listThuongHieu = [];
    $scope.getListThuongHieu = function () {
      $http
        .get("http://localhost:8080/api/v1/thuoc-tinh/show-thuong-hieu")
        .then(function (response) {
          $scope.listThuongHieu = response.data;
        });
    };
    $scope.getListThuongHieu();

    $scope.listXuatXu = [];
    $scope.getListXuatXu = function () {
      $http
        .get("http://localhost:8080/api/v1/thuoc-tinh/show-xuat-xu")
        .then(function (response) {
          $scope.listXuatXu = response.data;
        });
    };
    $scope.getListXuatXu();

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
  }
);
