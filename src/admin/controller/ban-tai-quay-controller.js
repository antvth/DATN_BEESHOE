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

      // TODO: Lấy ra tất cả bản ghi của chất liệu
      $scope.listChatLieu = [];
      $scope.getListChatLieu = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get("http://localhost:8080/api/v1/chat-lieu/show", config)
          .then(function (response) {
            $scope.listChatLieu = response.data;
          });
      };
      $scope.getListChatLieu();
  
      // TODO: Lấy ra tất cả bản ghi của size
      $scope.listSize = [];
      $scope.getListSize = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get("http://localhost:8080/api/v1/size/show", config)
          .then(function (response) {
            $scope.listSize = response.data;
          });
      };
      $scope.getListSize();
  
      // TODO: Lấy ra tất cả bản ghi của màu sắc
      $scope.listMauSac = [];
      $scope.getListMauSac = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get("http://localhost:8080/api/v1/mau-sac/show", config)
          .then(function (response) {
            $scope.listMauSac = response.data;
          });
      };
      $scope.getListMauSac();
  
      // TODO: Lấy ra tất cả bản ghi của thương hiệu
      $scope.listThuongHieu = [];
      $scope.getListThuongHieu = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi", config)
          .then(function (response) {
            $scope.listThuongHieu = response.data;
          });
      };
      $scope.getListThuongHieu();
  
      // TODO: Lấy ra tất cả bản ghi của danh mục
      $scope.listDanhMuc = [];
      $scope.getListDanhMuc = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get("http://localhost:8080/api/v1/danh-muc/show", config)
          .then(function (response) {
            $scope.listDanhMuc = response.data;
          });
      };
      $scope.getListDanhMuc();
  
      // TODO: Lấy ra tất cả bản ghi của kiểu đế
      $scope.listKieuDe = [];
      $scope.getListKieuDe = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get("http://localhost:8080/api/v1/kieu-de/show", config)
          .then(function (response) {
            $scope.listKieuDe = response.data;
          });
      };
      $scope.getListKieuDe();
  
      // TODO: Lấy ra tất cả bản ghi của sản phẩm
      $scope.listXuatXu = [];
      $scope.getListXuatXu = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get("http://localhost:8080/api/v1/xuat-xu/show", config)
          .then(function (response) {
            $scope.listXuatXu = response.data;
          });
      };
      $scope.getListXuatXu();
  
      $scope.pageNumberSp = 0; // Trang hiện tại
      $scope.pageSizeSp = 20; // Số bản ghi trên mỗi trang
      // TODO: Get ALL sản phẩm tại quầy
      $scope.getListSanPhamTaiQuay = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/hien-thi?pageNumber=" +
              $scope.pageNumberSp +
              "&pageSize=" +
              $scope.pageSizeSp,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            $scope.keyName = "";
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSizeSp) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      };
  
      $scope.getListSanPhamTaiQuay();
  
      $scope.previousPageSp = function () {
        if ($scope.pageNumberSp > -1) {
          $scope.pageNumberSp--;
          $scope.getListSanPhamTaiQuay();
        }
      };
  
      $scope.nextPageSp = function () {
        $scope.pageNumberSp++;
        $scope.getListSanPhamTaiQuay();
      };
  
      // TODO: Tìm kiếm sản phẩm
      $scope.searchKeyName = "";
      $scope.searchSanPham = function () {
        var token = $window.localStorage.getItem("token");
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/search-name?pageNumber=" +
              $scope.pageNumberSp +
              "&pageSize=" +
              $scope.pageSizeSp +
              "&name=" +
              $scope.searchKeyName,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            console.log($scope.listSanPhamTaiQuay);
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      };
  
      $scope.lamMoiSanPhamTaiQuay = function () {
        $scope.searchKeyName = "";
        $scope.brand = "";
        $scope.locCategory = "";
        $scope.locSole = "";
        $scope.locOrigin = "";
        $scope.locMauSac = "";
        $scope.locMaterial = "";
        $scope.locSize = "";
        $scope.getListSanPhamTaiQuay();
      };
  
      // TODO:  Lọc sản phẩm theo thương hiệu
      $scope.brand = "";
      $scope.filterBrand = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        var params = {
          pageNumber: $scope.pageNumber || 0,
          pageSize: $scope.pageSize || 20,
          tenThuongHieu: $scope.brand || null,
          tenXuatXu: $scope.locOrigin || null,
          tenDanhMuc: $scope.locCategory || null,
          tenDe: $scope.locSole || null,
          tenChatLieu: $scope.locMaterial || null,
          tenMauSac: $scope.locMauSac || null,
          size: $scope.locSize || null,
        };
  
        var config = {
          headers: {
            Authorization: "Bearer " + $window.localStorage.getItem("token"),
            Accept: "application/json",
            // Add other headers if needed
          },
          params: params,
        };
  
        $http
          .get("http://localhost:8080/api/chi-tiet-sp/filter-brand", config)
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
              $scope.showNextButton = false;
            } else {
              $scope.showNextButton = true;
            }
          })
          .catch(function (error) {
            // Xử lý lỗi nếu có
          });
      };
  
      // TODO: Lọc sản phẩm theo category
      $scope.locCategory = "";
      $scope.filterCategory = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        if ($scope.locCategory === "") {
          $scope.getListSanPhamTaiQuay();
        } else {
          $http
            .get(
              "http://localhost:8080/api/chi-tiet-sp/filter-category?pageNumber=" +
                $scope.pageNumberSp +
                "&pageSize=" +
                $scope.pageSizeSp +
                "&name=" +
                $scope.locCategory,
              config
            )
            .then(function (response) {
              $scope.listSanPhamTaiQuay = response.data;
              if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
                $scope.showNextButton = false; // Ẩn nút "Next"
              } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
              }
            });
        }
      };
  
      // TODO:  Lọc sản phẩm theo kiểu đế
      $scope.locSole = "";
      $scope.filterSole = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        if ($scope.locSole === "") {
          $scope.getListSanPhamTaiQuay();
        } else {
          $http
            .get(
              "http://localhost:8080/api/chi-tiet-sp/filter-sole?pageNumber=" +
                $scope.pageNumberSp +
                "&pageSize=" +
                $scope.pageSizeSp +
                "&name=" +
                $scope.locSole,
              config
            )
            .then(function (response) {
              $scope.listSanPhamTaiQuay = response.data;
              if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
                $scope.showNextButton = false; // Ẩn nút "Next"
              } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
              }
            });
        }
      };
  
      // TODO:  Lọc sản phẩm theo xuất xứ
      $scope.locOrigin = "";
      $scope.filterOrigin = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        if ($scope.locOrigin === "") {
          $scope.getListSanPhamTaiQuay();
        } else {
          $http
            .get(
              "http://localhost:8080/api/chi-tiet-sp/filter-origin?pageNumber=" +
                $scope.pageNumberSp +
                "&pageSize=" +
                $scope.pageSizeSp +
                "&name=" +
                $scope.locOrigin,
              config
            )
            .then(function (response) {
              $scope.listSanPhamTaiQuay = response.data;
              if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
                $scope.showNextButton = false; // Ẩn nút "Next"
              } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
              }
            });
        }
      };
  
      // TODO:  Lọc sản phẩm theo size
      $scope.locSize = "";
      $scope.filterSize = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        if ($scope.locSize === "") {
          $scope.getListSanPhamTaiQuay();
        } else {
          $http
            .get(
              "http://localhost:8080/api/chi-tiet-sp/filter-size?pageNumber=" +
                $scope.pageNumberSp +
                "&pageSize=" +
                $scope.pageSizeSp +
                "&size=" +
                $scope.locSize,
              config
            )
            .then(function (response) {
              $scope.listSanPhamTaiQuay = response.data;
              if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
                $scope.showNextButton = false; // Ẩn nút "Next"
              } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
              }
            });
        }
      };
  
      // TODO:  Lọc sản phẩm theo chất liệu
      $scope.locMaterial = "";
      $scope.filterMaterial = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        if ($scope.locMaterial === "") {
          $scope.getListSanPhamTaiQuay();
        } else {
          $http
            .get(
              "http://localhost:8080/api/chi-tiet-sp/filter-material?pageNumber=" +
                $scope.pageNumberSp +
                "&pageSize=" +
                $scope.pageSizeSp +
                "&name=" +
                $scope.locMaterial,
              config
            )
            .then(function (response) {
              $scope.listSanPhamTaiQuay = response.data;
              if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
                $scope.showNextButton = false; // Ẩn nút "Next"
              } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
              }
            });
        }
      };
  
      // TODO:  Lọc sản phẩm theo màu sắc
      $scope.locMauSac = "";
      $scope.filterColor = function () {
        var token = $window.localStorage.getItem("token");
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        if ($scope.locMauSac === "") {
          $scope.getListSanPhamTaiQuay();
        } else {
          $http
            .get(
              "http://localhost:8080/api/chi-tiet-sp/filter-color?pageNumber=" +
                $scope.pageNumberSp +
                "&pageSize=" +
                $scope.pageSizeSp +
                "&name=" +
                $scope.locMauSac,
              config
            )
            .then(function (response) {
              $scope.listSanPhamTaiQuay = response.data;
              if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
                $scope.showNextButton = false; // Ẩn nút "Next"
              } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
              }
            });
        }
      };
  }
);
