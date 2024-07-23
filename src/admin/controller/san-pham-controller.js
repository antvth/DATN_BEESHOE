myApp.controller("sanPhamController", function ($http, $scope, $window) {
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
  $scope.listSanPham = [];
  $scope.pageNumber = 0;
  $scope.pageSize = 10;
  $scope.filterSanPham = function () {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    $http
      .get(
        "http://localhost:8080/api/v1/san-pham/hien-thi?pageNumber=" +
          $scope.pageNumber +
          "&pageSize=" +
          $scope.pageSize,
        config
      )
      .then(function (response) {
        $scope.listSanPham = response.data;
        if ($scope.listSanPham.length < $scope.pageSize) {
          $scope.showNextButton = false; // Ẩn nút "Next"
        } else {
          $scope.showNextButton = true; // Hiển thị nút "Next"
        }
      });
  };

  $scope.filterSanPham();

  $scope.updatePage = function (pageNumber) {
    $scope.pageNumber = pageNumber;
    $scope.filterSanPham();
  };

  // TODO: Quay lại trang
  $scope.previousPage = function () {
    if ($scope.pageNumber > 0) {
      $scope.pageNumber--;
      $scope.filterSanPham();
    }
  };

  // TODO: tiến đến trang khác
  $scope.nextPage = function () {
    $scope.pageNumber++;
    $scope.filterSanPham();
  };

  $scope.lamMoiSanPham = function () {
    $scope.thuongHieu = "";
    $scope.danhMuc = "";
    $scope.xuatXu = "";
    $scope.kieuDe = "";
    $scope.status = "";
    $scope.value = "";
    $scope.filterSanPham();
  };

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
      .get("http://localhost:8080/api/v1/audilog/sanpham", config)
      .then(function (response) {
        $scope.listHistory = response.data;
      });
  }

  fetchHistortyList();
  $scope.thuongHieu;
  $scope.findByThuongHieu = function () {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if ($scope.thuongHieu === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/thuong-hieu?value=" +
            $scope.thuongHieu,
          config
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.danhMuc;
  $scope.findByDanhMuc = function () {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if ($scope.danhMuc === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/danh-muc?value=" +
            $scope.danhMuc,
          config
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.xuatXu;
  $scope.findByXuatXu = function () {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if ($scope.xuatXu === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/xuat-xu?value=" +
            $scope.xuatXu,
          config
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.kieuDe;
  $scope.findByKieuDe = function () {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if ($scope.kieuDe === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/kieu-de?value=" +
            $scope.kieuDe,
          config
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.value;
  $scope.findByNameOrCode = function () {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if ($scope.value === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/name-code?value=" +
            $scope.value,
          config
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.status;
  $scope.findByStatus = function () {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if ($scope.status === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/status?status=" +
            $scope.status,
          config
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

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
  $scope.searchVouchers = function () {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    // Make sure both startDate and endDate are provided
    if (!$scope.startDate || !$scope.endDate) {
      // Handle error or provide user feedback
      return;
    }

    var formattedStartDate = new Date($scope.startDate)
      .toISOString()
      .split("T")[0];
    var formattedEndDate = new Date($scope.endDate).toISOString().split("T")[0];

    var searchUrl =
      "http://localhost:8080/api/v1/audilog/sanphamseach?startDate=" +
      encodeURIComponent(formattedStartDate) +
      "&endDate=" +
      encodeURIComponent(formattedEndDate);

    $http.get(searchUrl, config).then(function (response) {
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
      "http://localhost:8080/api/v1/audilog/auditlogsanphambydate?searchDate=" +
      encodeURIComponent(formattedStartDate);
    $http.get(searchUrl, config).then(function (response) {
      $scope.listHistory = response.data;
    });
  };

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

  $scope.newProduct = {};
  $scope.isName = true;
  $scope.newProduct.maSanPham = "SP_" + new Date().getTime();
  var token = $window.localStorage.getItem("token");

  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  setTimeout(() => {
    $scope.createProduct = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham/findbyname/" +
              $scope.newProduct.productName,
            config
          )
          .then(function (response) {
            console.log(response.data);
            if (response.data) {
              $scope.isName = false; // Tên tồn tại
              console.log("vào đây không");
            } else {
              $http
                .post(
                  "http://localhost:8080/api/v1/san-pham/create",
                  $scope.newProduct,
                  config
                )
                .then(function (response) {
                  $scope.listSanPham.push(response.data);
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Thêm thành công",
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                      popup: "small-popup", // Add a class to the message
                    },
                  });
                  window.location.href =
                    "http://127.0.0.1:5505/src/admin/index-admin.html#/product-detail/create/" +
                    response.data.id;
                })
                .catch(function (error) {
                  $scope.errorMaSanPham = error.data.maSanPham;
                  $scope.errorProductName = error.data.productName;
                  $scope.errorDescribe = error.data.describe;
                  $scope.errorPrice = error.data.price;
                  $scope.errorBaoHanh = error.data.baoHang;
                  $scope.errorKieuDe = error.data.idKieuDe;
                  $scope.errorXuatXu = error.data.idXuatXu;
                  $scope.errorThuognHieu = error.data.idBrand;
                  $scope.errorDanhMuc = error.data.idCategory;
                });
            }
          });
      });
    };
  }, 2000);

  $scope.newThuongHieu = {};
  setTimeout(() => {
    $scope.createThuongHieu = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .post(
            "http://localhost:8080/api/v1/thuong-hieu/create",
            $scope.newThuongHieu,
            config
          )
          .then(function (response) {
            $scope.listThuongHieu.push(response.data);
            $("#brandModal").modal("hide");
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Thêm thành công",
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: "small-popup", // Add a class to the message
              },
            }).then(() => {
              $scope.getListThuongHieu();
            });
          })
          .catch(function (error) {
            $scope.errortenThuongHieu = error.data.tenThuongHieu;
            $scope.errortrangThai = error.data.trangThai;
          });
      });
    };
  }, 2000);

  $scope.newKieuDe = {};
  setTimeout(() => {
    $scope.createKieuDe = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .post(
            "http://localhost:8080/api/v1/kieu-de/create",
            $scope.newKieuDe,
            config
          )
          .then(function (response) {
            $scope.listKieuDe.push(response.data);
            $("#soleModal").modal("hide");
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Thêm thành công",
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: "small-popup", // Add a class to the message
              },
            }).then(() => {
              $scope.getListKieuDe();
            });
          })
          .catch(function (error) {
            $scope.errortenDe = error.data.tenDe;
            $scope.errortrangThai = error.data.trangThai;
          });
      });
    };
  }, 2000);

  $scope.newDanhMuc = {};
  setTimeout(() => {
    $scope.createDanhMuc = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .post(
            "http://localhost:8080/api/v1/danh-muc/create",
            $scope.newDanhMuc,
            config
          )
          .then(function (response) {
            $scope.listDanhMuc.push(response.data);
            $("#categoryModal").modal("hide");
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Thêm thành công",
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: "small-popup", // Add a class to the message
              },
            }).then(() => {
              $scope.getListDanhMuc();
            });
          })
          .catch(function (error) {
            $scope.errortenDanhMuc = error.data.tenDanhMuc;
            $scope.errortrangThai = error.data.trangThai;
          });
      });
    };
  }, 2000);

  $scope.newXuatXu = {};
  setTimeout(() => {
    $scope.createXuatXu = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
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
              "http://localhost:8080/api/v1/xuat-xu/create",
              $scope.newXuatXu,
              config
            )
            .then(function (response) {
              $scope.listXuatXu.push(response.data);
              $("#xuatXuMoi").modal("hide");
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Thêm thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Add a class to the message
                },
              });
              $scope.getListXuatXu();
            })
            .catch(function (error) {
              $scope.errortenXuatXu = error.data.tenXuatXu;
              $scope.errortrangThai = error.data.trangThai;
            });
        }
      });
    };
  }, 2000);
});
