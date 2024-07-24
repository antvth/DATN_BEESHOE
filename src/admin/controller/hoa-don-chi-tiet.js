myApp.controller(
  "hoaDonChiTietController",
  function ($http, $scope, $routeParams, $window, StatusService) {
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
    // Xác định `id` từ `$routeParams`
    var id = $routeParams.id;

    const breadcrumbSteps = document.querySelectorAll(".breadcrumb__step");
    // Xử lý sự kiện breadcrumb nếu cần
    for (let i = 0; i < breadcrumbSteps.length; i++) {
      const item = breadcrumbSteps[i];
      item.onclick = () => {
        // Loại bỏ lớp 'breadcrumb__step--active' khỏi tất cả các breadcrumb
        breadcrumbSteps.forEach((step) => {
          step.classList.remove("breadcrumb__step--active");
        });

        // Đánh dấu breadcrumb hiện tại và tất cả các breadcrumb trước nó
        for (let j = 0; j <= i; j++) {
          breadcrumbSteps[j].classList.add("breadcrumb__step--active");
        }
      };
    }

    // Gọi hàm để lấy dữ liệu chi tiết hoá đơn dựa trên `id`
    $scope.hoaDonChiTiet = {};
    $scope.thongBaoLoi = false;
    $scope.getHoaDonChiTiet = function () {
      var token = $window.localStorage.getItem("token");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      const apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-don/" + id;
      $http.get(apiUrl, config).then(function (response) {
        $scope.hoaDonChiTiet = response.data;
        if (
          $scope.hoaDonChiTiet.trangThai == 3 &&
          $scope.hoaDonChiTiet.tenNguoiShip == null &&
          $scope.hoaDonChiTiet.sdtNguoiShip == null
        ) {
          $scope.thongBaoLoi = true;
        } else {
          $scope.thongBaoLoi = false;
        }
      });
      $scope.thongBaoLoi = true;
    };
    $scope.getHoaDonChiTiet();

    $scope.listSanPhamInOrder = [];
    $scope.tongTienKhongGiam = 0;
    $scope.tongTienSauGiam = 0;
    $scope.tongTienKhongGiamHoanTra = 0;
    $scope.tongTienSauGiamHoanTra = 0;
    $scope.tongTienHoanTra = 0;

    // Hàm để tải sản phẩm từ API
    $scope.pageNumberHDCT = 0;
    $scope.pageSizeHDCT = 20;
    $scope.getSanPham = function () {
      var token = $window.localStorage.getItem("token");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-san-pham/" + id +
        "?pageNumber=" + $scope.pageNumberHDCT +
        "&pagesize=" + $scope.pageSizeHDCT;
      $http.get(apiUrl, config).then(function (response) {
        // Gán dữ liệu sản phẩm vào biến $scope.hoaDonChiTiet.sanPham
        $scope.listSanPhamInOrder = response.data;
        if ($scope.listSanPhamInOrder.length < $scope.pageSize) {
          $scope.showNextButtonHdc = false;
        } else {
          $scope.showNextButtonHdc = true;
        }
        for (var i = 0; i < $scope.listSanPhamInOrder.length; i++) {
          if (
            $scope.listSanPhamInOrder[i].donGiaSauGiam !=
            $scope.listSanPhamInOrder[i].giaBan &&
            $scope.listSanPhamInOrder[i].trangThai == 7
          ) {
            $scope.tongTienSauGiamHoanTra +=
              $scope.listSanPhamInOrder[i].donGiaSauGiam *
              $scope.listSanPhamInOrder[i].soLuong;
          }
          if (
            $scope.listSanPhamInOrder[i].donGiaSauGiam ==
            $scope.listSanPhamInOrder[i].giaBan &&
            $scope.listSanPhamInOrder[i].trangThai == 7
          ) {
            $scope.tongTienKhongGiamHoanTra +=
              $scope.listSanPhamInOrder[i].giaBan *
              $scope.listSanPhamInOrder[i].soLuong;
          }
        }
        $scope.tongTienHoanTra =
          $scope.tongTienSauGiamHoanTra + $scope.tongTienKhongGiamHoanTra;
      });
    };

    $scope.getSanPham();
    $scope.previousPageHDCT = function () {
      if ($scope.pageNumberHDCT > -1) {
        $scope.pageNumberHDCT--;
        $scope.getSanPham();
      }
    };

    $scope.nextPageHDCT = function () {
      $scope.pageNumberHDCT++;
      $scope.getSanPham();
    };


    $scope.soTienKhachTra = 0;
    $scope.soTienHoan = 0;
    $scope.getlichSuThanhToan = function () {
      var token = $window.localStorage.getItem("token");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-lich-su/" + id;

      $http.get(apiUrl, config).then(function (response) {
        $scope.lichSu = response.data;
        for (var i = 0; i < $scope.lichSu.length; i++) {
          if ($scope.lichSu[i].tenLoai == "Khách thanh toán") {
            $scope.soTienKhachTra += $scope.lichSu[i].soTienTra;
          }
          if ($scope.lichSu[i].tenLoai == "Nhân viên hoàn tiền") {
            $scope.soTienHoan += $scope.lichSu[i].soTienTra;
          }
        }
      });
    };
    $scope.getlichSuThanhToan();

    // Gọi hàm để lấy dữ liệu lịch trạng thái sử dựa trên `id`
    $scope.lichSuThayDoi = [];

    $scope.getlichSuThayDoi = function () {
      var token = $window.localStorage.getItem("token");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-trang-thai/" +
        id;

      $http.get(apiUrl, config).then(function (response) {
        $scope.lichSuThayDoi = response.data;
      });
    };

    $scope.getlichSuThayDoi();

    $scope.huyHoaDon = {
      ghiChu: "",
      newTrangThai: 6,
    };
    setTimeout(() => {
      $scope.comfirmStatusHuyDon = function () {
        var token = $window.localStorage.getItem("token");
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        Swal.fire({
          title: "Bạn có muốn hủy đơn này không?",
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
            $http
              .put(
                "http://localhost:8080/api/v1/hoa-don-chi-tiet/huy-don/" + id,
                $scope.huyHoaDon,
                config
              )
              .then(function (response) {
                $("#huydon").modal("hide"); //
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
              })
              .catch(function (error) {
                $scope.errorGhiChu1 = error.data.ghiChu;
              });
          }
        });
      };
    }, 2000);

    $scope.confirmAction = function () {
      if ($scope.thongBaoLoi) {
        $scope.thongBaoLoiGiao();
      } else {
        $("#exampleModal").modal("show"); // Mở modal
      }
    };

    $scope.thongBaoLoiGiao = function () {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Vui lòng cập nhập người giao",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "small-popup",
        },
      });
    };

    $scope.newStatusOrder = {
      ghiChu: "",
      newTrangThai: "",
    };
    $scope.comfirmStatusOrder = function () {
      Swal.fire({
        title: "Bạn có muốn thay đổi trạng thái hóa đơn?",
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
              "http://localhost:8080/api/v1/hoa-don-chi-tiet/confirm-order/" +
              id,
              JSON.stringify($scope.newStatusOrder),
              config
            )
            .then(function (response) {
              $scope.lichSuThayDoi.push(response.data);
              $window.location.reload();
              $("#exampleModal").modal("hide");
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup",
                },
              }).then(() => { });
            })
            .catch(function (error) {
              $scope.errorGhiChu = error.data.ghiChu;
              $scope.errorTrangThai = error.data.newTrangThai;
            });
        }
      });
    };

    $scope.orderDetailUpdate = {};
    setTimeout(() => {
      $scope.confirmOrderClient = function () {
        Swal.fire({
          title: "Bạn có muốn thay đổi thông tin đơn hàng?",
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
              .put(
                "http://localhost:8080/api/v1/hoa-don-chi-tiet/confirm-order-client/" +
                id,
                $scope.orderDetailUpdate,
                config
              )
              .then(function (response) {
                $("#updateGiao").modal("hide");
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Cập nhập thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                });
                $scope.getHoaDonChiTiet();
                $scope.getSanPham();
                $scope.getlichSuThanhToan();
                $scope.getlichSuThayDoi();
                $scope.selectMoney(id);
                $scope.getTongTienHang();
                $scope.getOrderDetailUpdate();
              })
              .catch(function (error) {
                console.log(error.data);
                $scope.errorTienShip = error.data.tienShip;
                $scope.errorDiaChi = error.data.diaChi;
                $scope.errorHoVatenClient = error.data.hoVatenClient;
                $scope.errorEmail = error.data.email;
                $scope.errorSdtClient = error.data.sdtClient;
              });
          }
        });
      };
    }, 2000);

    setTimeout(() => {
      $scope.confirmOrderdeliver = function () {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        Swal.fire({
          title: "Bạn có muốn thay đổi thông tin đơn hàng?",
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
            $http
              .put(
                "http://localhost:8080/api/v1/hoa-don-chi-tiet/confirm-order-deliver/" +
                id,
                $scope.orderDetailUpdate,
                config
              )
              .then(function (response) {
                $("#updateNguoiGiao").modal("hide");
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Cập nhập thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                });
                $scope.getHoaDonChiTiet();
                $scope.getSanPham();
                $scope.getlichSuThanhToan();
                $scope.getlichSuThayDoi();
                $scope.selectMoney(id);
                $scope.getTongTienHang();
                $scope.getOrderDetailUpdate();
              })
              .catch(function (error) {
                $scope.errorTenNguoiGiao = error.data.tenNguoiGiao;
                $scope.errorSoDienThoaiGiao = error.data.soDienThoaiGiao;
              });
          }
        });
      };
    }, 2000);

    $scope.soLuongSanPham = 1; // số lượng thêm vào giỏ hàng

    setTimeout(() => {
      $scope.themSanPhamHoaDonChiTiet = function (idCtSp, soLuongSanPham) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
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
            $http
              .post(
                "http://localhost:8080/api/v1/hoa-don-chi-tiet/them-san-pham?idHoaDon=" +
                id +
                "&idSanPhamChiTiet=" +
                idCtSp +
                "&soLuong=" +
                soLuongSanPham,
                {},
                config
              )
              .then(function (response) {
                $scope.listSanPhamInOrder.push(response.data);
                $scope.getHoaDonChiTiet();
                $scope.getSanPham();
                $scope.getlichSuThanhToan();
                $scope.getlichSuThayDoi();
                $scope.selectMoney(id);
                $scope.getTongTienHang();
                $scope.getOrderDetailUpdate();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm sản phẩm thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  $window.location.reload();
                });
              })
              .catch(function (error) { });
          }
        });
      };
    }, 2000);

    // cập nhập sản phẩm trong hóa đơn
    setTimeout(() => {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $scope.updateOrder = function (idHoaDonChiTiet, soLuong) {
        var apiURL =
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/update-quantity?idHoaDonChiTiet=" +
          idHoaDonChiTiet +
          "&quantity=" +
          soLuong;
        $http({
          url: apiURL,
          method: "PUT",
          headers: config.headers,
          transformResponse: [
            function () {
              $scope.getHoaDonChiTiet();
              $scope.getSanPham();
              $scope.getlichSuThanhToan();
              $scope.getlichSuThayDoi();
              $scope.selectMoney(id);
              $scope.getTongTienHang();
              $scope.getOrderDetailUpdate();
              $window.location.reload();
            },
          ],
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

    $scope.getPaginationNumbers = function () {
      var paginationNumbers = [];
      var totalPages = Math.ceil(
        $scope.listSanPhamTaiQuay.length / $scope.pageSizeSp
      );
      var startPage = Math.max(1, $scope.pageNumberSp - 3);
      var endPage = Math.min(startPage + 6, totalPages);

      for (var i = startPage; i <= endPage; i++) {
        paginationNumbers.push(i);
      }

      return paginationNumbers;
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

    // TODO:  Lọc sản phẩm theo thương hiệu
    $scope.brand = "";
    $scope.filterBrand = function () {
      // if ($scope.brand == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locCategory == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locSole == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locOrigin == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locMauSac == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locMaterial == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locSize == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
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
    $scope.locCategory;
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
            "http://localhost:8080/api/chi-tiet-sp/filter-category?name=" +
            $scope.locCategory,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
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
            "http://localhost:8080/api/chi-tiet-sp/filter-sole?name=" +
            $scope.locSole,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
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
            "http://localhost:8080/api/chi-tiet-sp/filter-origin?name=" +
            $scope.locOrigin,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo size
    $scope.locSize;
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
            "http://localhost:8080/api/chi-tiet-sp/filter-size?size=" +
            $scope.locSize,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
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
            "http://localhost:8080/api/chi-tiet-sp/filter-material?name=" +
            $scope.locMaterial,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
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
            "http://localhost:8080/api/chi-tiet-sp/filter-color?name=" +
            $scope.locMauSac,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    $scope.fillProductTraHang = {};
    $scope.selectProductTraHang = function (id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/detail-product?idhdct=" +
          id,
          config
        )
        .then(function (response) {
          $scope.fillProductTraHang = response.data;
        });
    };

    $scope.newOrderDetail = {};
    $scope.newOrderDetail.soLuong = 1
    setTimeout(() => {
      $scope.traHang = function (idHoaDonChiTiet) {
        Swal.fire({
          title: "Bạn có muốn trả hàng?",
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
                "http://localhost:8080/api/v1/hoa-don-chi-tiet/tra-hang?id=" +
                id +
                "&idhdct=" +
                idHoaDonChiTiet,
                JSON.stringify($scope.newOrderDetail),
                config
              )
              .then(function (response) {
                $scope.listSanPhamInOrder.push(response.data);
                $scope.newOrderDetail = {};
                $("#oki").modal("hide");
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Trả hàng thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                });
                $scope.getlichSuThanhToan();
                $scope.getHoaDonChiTiet();
                $scope.getSanPham();
                $scope.getlichSuThayDoi();
                $scope.selectMoney(id);
                $scope.getTongTienHang();
                $scope.getOrderDetailUpdate();
              })
              .catch(function (error) {
                $scope.errorSoLuong = error.data.soLuong;
                $scope.errorGhiChu = error.data.ghiChu;
              });
          }
        });
      };
    }, 2000);

    // delete sản phẩm trong giỏ hàng
    setTimeout(() => {
      $scope.deleteProduct = function (event, index) {
        Swal.fire({
          title: "Bạn có muốn xóa sản phẩm này khỏi hóa đơn?",
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
            let p = $scope.listSanPhamInOrder[index];
            var token = $window.localStorage.getItem("token");
            console.log(p.idHoaDonChiTiet);
            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .delete(
                "http://localhost:8080/api/v1/hoa-don-chi-tiet/delete?idHoaDon=" +
                id +
                "&id=" +
                p.idHoaDonChiTiet,
                config
              )
              .then(function () {
                $scope.listSanPhamInOrder.splice(index, 1);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Xóa thành công",
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

    $scope.fillMoney = {};
    $scope.selectMoney = function (id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/thanh-tien/" + id,
          config
        )
        .then(function (response) {
          $scope.fillMoney = response.data;
        });
    };
    $scope.selectMoney(id);

    $scope.traHangis = false;
    $scope.isTraHang = function (id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/tra-hang/" + id,
          config
        )
        .then(function (response) {
          $scope.traHangis = response.data;
        });
    };
    $scope.isTraHang(id);

    // API ĐỊA CHỈ
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.getTinh = function () {
      $http
        .get("https://provinces.open-api.vn/api/?depth=1")
        .then(function (response) {
          $scope.provinces = response.data;
        });
    };

    $scope.getTinh();

    $scope.getDistricts = function () {
      $http
        .get(
          "https://provinces.open-api.vn/api/p/" +
          $scope.selectedProvince.code +
          "?depth=2"
        )
        .then(function (response) {
          $scope.districts = response.data.districts;
        });
    };

    $scope.getWards = function () {
      $http
        .get(
          "https://provinces.open-api.vn/api/d/" +
          $scope.selectedDistrict.code +
          "?depth=2"
        )
        .then(function (response) {
          $scope.wards = response.data.wards;
        });
    };

    $scope.getOrderDetailUpdate = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/order-detail-update/" +
          id,
          config
        )
        .then(function (response) {
          $scope.orderDetailUpdate = response.data;
        });
    };

    $scope.getOrderDetailUpdate();
    setTimeout(() => {
      $scope.generatePDF = function () {
        Swal.fire({
          title: "Bạn có muốn in hóa đơn không?",
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
              .get("http://localhost:8080/api/v1/pdf/pdf/generate/" + id, {
                responseType: "arraybuffer",
                headers: config.headers, // Thêm headers vào request
              })
              .then(function (response) {
                var file = new Blob([response.data], {
                  type: "application/pdf",
                });
                var fileURL = URL.createObjectURL(file);
                var a = document.createElement("a");
                a.href = fileURL;
                a.download =
                  "pdf_" +
                  new Date().toISOString().slice(0, 19).replace(/:/g, "-") +
                  ".pdf";
                document.body.appendChild(a);
                a.click();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "In thành công",
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

    $scope.tongTienHang = 0;
    $scope.getTongTienHang = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/tong-tien-don-hang/" +
          id,
          config
        )
        .then(function (response) {
          $scope.tongTienHang = response.data;
        });
    };

    $scope.getTongTienHang();
  }
);
