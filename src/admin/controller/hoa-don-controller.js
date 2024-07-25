myApp.controller("hoaDonController", function ($http, $scope, $window) {
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

  $scope.listHoaDon = [];
  $scope.selectedTrangThai = "";
  $scope.selectedLoaiDon = "";
  $scope.searchQuery = "";
  $scope.pageNumber = 0;
  $scope.allTenNhanVienOptions = [];
  $scope.isAdmin = false;

  function getRole() {
    if (role === "ADMIN") {
      $scope.isAdmin = true;
    }
  }

  getRole();

  $scope.fetchHoaDon = function (trangThai, loaiDon, tenNhanVien, pageNumber) {
    trangThai = trangThai || "";
    loaiDon = loaiDon || "";
    tenNhanVien = tenNhanVien || "";

    var token = $window.localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    var url = `http://localhost:8080/api/v1/hoa-don/hien-thi?trangThaiHD=${trangThai}&pageNumber=${pageNumber}`;

    if (loaiDon !== "") {
      url += "&loaiDon=" + loaiDon;
    }

    if (tenNhanVien !== "") {
      url += "&tenNhanVien=" + tenNhanVien;
    }

    if ($scope.searchQuery !== "") {
      url += isNaN($scope.searchQuery)
        ? "&ma=" + $scope.searchQuery
        : "&soDienThoai=" + $scope.searchQuery;
    }

    $http.get(url, config).then(function (response) {
      if (
        Array.isArray(response.data) &&
        response.data.length > 0 &&
        response.data[0].hasOwnProperty("tenNhanVien")
      ) {
        $scope.listHoaDon = response.data;
        if ($scope.listHoaDon.length < 20) {
          $scope.showNextButtonSpInCart = false; // Ẩn nút "Next"
        } else {
          $scope.showNextButtonSpInCart = true; // Hiển thị nút "Next"
        }
      } else {
        console.error("Invalid data format from API");
        // Nếu không có dữ liệu, đặt $scope.listHoaDon về mảng rỗng
        $scope.listHoaDon = [];
      }
    });
  };

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.searchHoaDon = function () {
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.filterHoaDon = function () {
    // Gọi hàm fetchHoaDon với các tham số hiện tại
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.filterHoaDonByNguoiXacNhan = function () {
    // Gọi hàm fetchHoaDon với các tham số hiện tại
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.setDefaultTrangThai = function () {
    // Đặt giá trị mặc định cho selectedTrangThai và selectedLoaiDon
    $scope.selectedTrangThai = 1;
    $scope.selectedLoaiDon = 1;
    // Gọi hàm fetchHoaDon để hiển thị danh sách theo giá trị mặc định
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.openCity = function (trangThai, loaiDon) {
    $scope.selectedTrangThai = trangThai;
    $scope.selectedLoaiDon = loaiDon || "";
    $scope.pageNumber = 0;
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.previousPage = function () {
    if ($scope.pageNumber > 0) {
      $scope.pageNumber--;
      $scope.fetchHoaDon(
        $scope.selectedTrangThai,
        $scope.selectedLoaiDon,
        $scope.selectedTenNhanVien,
        $scope.pageNumber
      );
    }
  };

  $scope.listNhanVien = [];
  $scope.getListNhanVien = function () {
    var token = $window.localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    $http
      .get(
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/list-nhan-vien",
        config
      )
      .then(function (response) {
        $scope.listNhanVien = response.data;

        // Gán fullName vào allTenNhanVienOptions
        $scope.allTenNhanVienOptions = response.data
          .filter(function (nhanVien) {
            return nhanVien.maTaiKhoan !== null && nhanVien.maTaiKhoan !== undefined;
          })
          .map(function (nhanVien) {
            return {
              tenNhanVien: nhanVien.maTaiKhoan,
              idNhanVien: nhanVien.id // Chỉ định idNhanVien tương ứng
            };
          });
      });
  };

  $scope.getListNhanVien();

  $scope.employeeAndInvoiceInfo = {};
  $scope.getEmployeeAndInvoiceInfo = function (idHoaDon) {
    var token = $window.localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    $http
      .get(
        "http://localhost:8080/api/v1/hoa-don/employee-and-invoice?idHoaDon=" +
        idHoaDon,
        config
      )
      .then(function (response) {
        $scope.employeeAndInvoiceInfo = response.data;
      });
  };

  $scope.selectedId = "";
  $scope.updateNhanVien = function (idHoaDon) {
    var token = $window.localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    $http
      .put(
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/update-nhan-vien?idHoaDon=" +
        idHoaDon +
        "&idNhanVien=" +
        $scope.selectedId,
        null,
        config
      )
      .then(function (response) {
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
        $scope.fetchHoaDon(
          $scope.selectedTrangThai,
          $scope.selectedLoaiDon,
          $scope.selectedTenNhanVien,
          $scope.pageNumber
        );
      });
  };

  // Khởi tạo mặc định
  $scope.setDefaultTrangThai();
});
