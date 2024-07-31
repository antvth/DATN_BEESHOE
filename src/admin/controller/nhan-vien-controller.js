myApp.controller("nhanVienController", function ($http, $scope, $location, $window) {
  var role = $window.localStorage.getItem("role");
  if (role === "STAFF") {
    Swal.fire({
      icon: "error",
      title: "Bạn không có quyền truy cập",
      text: "Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.",
    });
    window.history.back();
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
  $scope.listNhanVien = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedNhanVien = null;
  $scope.listNhanVienRole = [];
  $scope.pageNumber = 0;
  $scope.selectedNhanVienRole = null; // Thêm biến để lưu trữ vai trò được chọn
  $scope.newNhanVienRole = {
    idLoaiTaiKhoan: null, // hoặc giá trị mặc định khác nếu cần
  };

  var id = $location.search().id;

  function listRole() {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    $http
      .get("http://localhost:8080/api/v1/nhan-vien/hien-thi-roles", config)
      .then(function (response) {
        $scope.listNhanVienRole = response.data;
        console.log($scope.listNhanVienRol);
        // Kiểm tra và chọn giá trị nếu có
        if ($scope.selectedNhanVien && $scope.listNhanVienRole.length > 0) {
          selectRole($scope.selectedNhanVien.idLoaiTaiKhoan);
        }
      });
  }

  function selectRole(idLoaiTaiKhoan) {
    var role = $scope.listNhanVienRole.find(function (item) {
      return item.id === idLoaiTaiKhoan;
    });

    if (role) {
      $scope.selectedNhanVienRole = role;
    }
  }

  listRole();

  function fetchNhanVienList(trangThai, pageNumber) {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    var url = `http://localhost:8080/api/v1/nhan-vien/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;
    if ($scope.searchQuery) {
      if (!isNaN($scope.searchQuery)) {
        url += `&soDienThoai=${$scope.searchQuery}`;
      } else {
        url += `&maNhanVien=${$scope.searchQuery}`;
      }
    }
    $http
      .get(url, config)
      .then(function (response) {
        response.data.ngaySinh = new Date(response.data.ngaySinh);
        $scope.listNhanVien = response.data;
        if ($scope.listNhanVien.length < 20) {
          $scope.showNextButton = false; // Ẩn nút "Next"
        } else {
          $scope.showNextButton = true; // Hiển thị nút "Next"
        }
      })
      .catch(function (error) {
        console.error("Lỗi khi tìm kiếm: ", error);
      });
  }

  $scope.previousPage = function () {
    if ($scope.pageNumber > 0) {
      $scope.pageNumber--;
      fetchNhanVienList($scope.selectedTrangThai, $scope.pageNumber);
    }
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    fetchNhanVienList($scope.selectedTrangThai, $scope.pageNumber);
  };

  function fetchNhanVienDetail(id) {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    var detailUrl = "http://localhost:8080/api/v1/nhan-vien/detail?id=" + id;
    $http.get(detailUrl, config).then(function (response) {
      response.data.ngaySinh = new Date(response.data.ngaySinh);
      $scope.selectedNhanVien = response.data;
      console.log("Thông tin chi tiết nhân viên: ", $scope.selectedNhanVien);
      if ($scope.selectedNhanVien.trangThai === 1) {
        $scope.selectedNhanVien.trangThai = "1";
      } else {
        $scope.selectedNhanVien.trangThai = "2";
      }

      if ($scope.selectedNhanVien.gioiTinh === false) {
        $scope.selectedNhanVien.gioiTinh = "false";
      } else {
        $scope.selectedNhanVien.gioiTinh = "true";
      }

      $scope.selectedNhanVien.nhanVienId = id;

      // Kiểm tra và chọn giá trị nếu có
      if ($scope.listNhanVienRole.length > 0) {
        selectRole($scope.selectedNhanVien.idLoaiTaiKhoan);
      }
    });
  }

  $scope.updateNhanVien = function (updatedData) {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    var updateUrl =
      "http://localhost:8080/api/v1/nhan-vien/update?idNhanVien=" +
      $scope.selectedNhanVien.nhanVienId;

    $http
      .put(updateUrl, updatedData, config)
      .then(function (response) {
        console.log("Cập nhật thông tin nhân viên thành công: ", response.data);

        fetchNhanVienList($scope.selectedTrangThai, "", "", "");
      })
      .catch(function (error) {
        console.error("Lỗi khi cập nhật thông tin nhân viên: ", error);
      });
  };

  $scope.newNhanVien = {};

  // validation here
  $scope.isHoTenValid = true;
  $scope.isNgaySinhValid = true;
  $scope.isSoDienThoaiValid = true;
  $scope.isGioiTinhValid = true;
  $scope.isEmailValid = true;
  $scope.isProvinceValid = true;
  $scope.isDistrictValid = true;
  $scope.isWardValid = true;
  $scope.isDiaChiValid = true;
  $scope.isTrangThaiValid = true;
  $scope.isFileValid = true;

  $scope.isSoDienThoaiIsPresent = true;
  $scope.isEmailIsPresent = true;

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

  $scope.createNhanVien = function () {
    $scope.isHoTenValid = !!$scope.ten;
    $scope.isNgaySinhValid = !!$scope.ngaySinh;
    $scope.isSoDienThoaiValid = !!$scope.soDienThoai;
    $scope.isGioiTinhValid = !!$scope.gioiTinh;
    $scope.isEmailValid = !!$scope.email;
    $scope.isDiaChiValid = !!$scope.diaChi;
    $scope.isTrangThaiValid = !!$scope.trangThai;

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
      !$scope.isNgaySinhValid ||
      !$scope.isSoDienThoaiValid ||
      !$scope.isGioiTinhValid ||
      !$scope.isEmailValid ||
      !$scope.isDiaChiValid ||
      !$scope.isTrangThaiValid
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

    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    $http
      .get(
        "http://localhost:8080/api/ql-khach-hang/find-by-so-dien-thoai?soDienThoai=" +
        $scope.soDienThoai,
        config
      )
      .then(function (response) {
        if (response.data > 0) {
          $scope.isSoDienThoaiIsPresent = false; // Số điện thoại đã tồn tại
          return;
        }
        if (response.data === 0) {
          $scope.isSoDienThoaiIsPresent = true; // Số điện thoại OK
        }


        $http
          .get(
            "http://localhost:8080/api/ql-khach-hang/find-by-email?email=" +
            $scope.email,
            config
          )
          .then(function (response) {
            if (response.data > 0) {
              $scope.isEmailIsPresent = false; // Email đã tồn tại
              return;
            }
            if (response.data === 0) {
              $scope.isEmailIsPresent = true; // Email OK
            }

            if ($scope.isSoDienThoaiIsPresent == true || $scope.isEmailIsPresent == true) {
              var yourFile = document.getElementById("fileInput").files[0];
              $http({
                method: "POST",
                url: "http://localhost:8080/api/v1/nhan-vien/create",
                headers: Object.assign(
                  {
                    "Content-Type": undefined,
                  },
                  config.headers
                ),
                transformRequest: function (data) {
                  var formData = new FormData();
                  formData.append("file", data.file);
                  formData.append("fullName", data.fullName);
                  formData.append("email", data.email);
                  formData.append("soDienThoai", data.soDienThoai);
                  formData.append("gioiTinh", data.gioiTinh);
                  formData.append("ngaySinh", data.ngaySinh);
                  formData.append("trangThai", data.trangThai);
                  formData.append("diaChi", data.diaChi);
                  return formData;
                },
                data: {
                  file: yourFile,
                  fullName: $scope.ten,
                  email: $scope.email,
                  soDienThoai: $scope.soDienThoai,
                  gioiTinh: $scope.gioiTinh,
                  ngaySinh: $scope.ngaySinh,
                  trangThai: $scope.trangThai,
                  diaChi: $scope.diaChi,
                },
              }).then(
                function (response) {
                  $scope.selectedKhachHang.push(response.data);
                },
                function (error) {
                  // Xử lý error ở đây
                }
              );
            }
          });
      });
  };

  $scope.fetchNhanVienDetail = function (id) {
    fetchNhanVienDetail(id);
  };

  $scope.onTrangThaiChange = function () {
    fetchNhanVienList($scope.selectedTrangThai, "", "", "");
  };

  $scope.searchNhanVien = function () {
    fetchNhanVienList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    fetchNhanVienList($scope.selectedTrangThai, "", "", "");
  };

  if (id) {
    fetchNhanVienDetail(id);
  } else {
    $scope.onTrangThaiChange();
  }

  // Khi danh sách roles được load xong, kiểm tra và chọn giá trị nếu có
  $scope.$watch("selectedNhanVien", function (newSelectedNhanVien) {
    if (newSelectedNhanVien && $scope.listNhanVienRole.length > 0) {
      // Cập nhật giá trị newNhanVienRole.idLoaiTaiKhoan
      $scope.newNhanVienRole.idLoaiTaiKhoan =
        newSelectedNhanVien.idLoaiTaiKhoan;
    }
  });

});
function displayImage(event) {
  var image = document.getElementById("selectedImage");
  image.style.display = "block";
  var selectedFile = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    image.src = event.target.result;
  };

  reader.readAsDataURL(selectedFile);
}
