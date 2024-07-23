myApp.controller(
  "sanPhamChiTietCreateController",
  function ($scope, $http, $routeParams, $window) {
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
    var id = $routeParams.id;

    $scope.productDetail = [];
    $scope.getProductDetail = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/product-detail/" + id,
          config
        )
        .then(function (response) {
          $scope.productDetail = response.data;
          $scope.generateQRCode($scope.productDetail.qrcode);
        });
    };
    $scope.getProductDetail();

    $scope.product = {};
    $scope.getProduct = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/san-pham/product/" + id, config)
        .then(function (response) {
          $scope.product = response.data;
         console.log(response.data);
        });
    };
    $scope.getProduct();

    $scope.image = [];
    $scope.getImage = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/images/image/" + id, config)
        .then(function (response) {
          $scope.image = response.data;
        });
    };
    $scope.getImage();

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

    $scope.newProductDetail = {};
    setTimeout(() => {
      $scope.createProductDetail = function () {
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
            console.log(token);

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .post(
                "http://localhost:8080/api/v1/san-pham-chi-tiet/create/" + id,
                $scope.newProductDetail,
                config
              )
              .then(function (response) {
                $scope.productDetail.push(response.data);
                $("#productDetailModal").modal("hide");
                $scope.newProductDetail = {};
                $scope.getProductDetail();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                })
              })
              .catch(function (error) {
                $scope.errorSoLuong = error.data.soLuong;
                $scope.errorChatLieu = error.data.idChatLieu;
                $scope.errorSize = error.data.idSize;
                $scope.errorMauSac = error.data.idMauSac;
              });
          }
        });
      };
    }, 2000);

    setTimeout(() => {
      $scope.updateStatusHuy = function (id) {
        Swal.fire({
          title: "Bạn có muốn hủy kích hoạt không?",
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
                "http://localhost:8080/api/v1/san-pham-chi-tiet/update-huy?id=" +
                  id,
                null,
                config
              )
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Hủy thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  $scope.getProductDetail();
                });
              });
          }
        });
      };
    }, 2000);

    $scope.getProduct = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/san-pham/product/" + id, config)
        .then(function (response) {
          $scope.product = response.data;
        });
    };
    $scope.getProduct();

    setTimeout(() => {
      $scope.updateStatusKichHoat = function (id) {
        Swal.fire({
          title: "Bạn có muốn kích hoạt không?",
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
                "http://localhost:8080/api/v1/san-pham-chi-tiet/update-kich?id=" +
                  id,
                null,
                config
              )
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Kích hoạt thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  $scope.getProductDetail();
                });
              });
          }
        });
      };
    }, 2000);

    $scope.uploadImages = function () {
      var token = $window.localStorage.getItem("token");

      var formData = new FormData();
      var input = document.getElementById("formFile");
      for (var i = 0; i < input.files.length; i++) {
        formData.append("files", input.files[i]);
      }
      formData.append("sanPhamId", id); // $scope.sanPhamId chứa ID sản phẩm

      $http
        .post("http://localhost:8080/api/v1/images/create", formData, {
          transformRequest: angular.identity,
          headers: {
            "Content-Type": undefined,
            Authorization: "Bearer " + token, // Truyền token vào header
          },
        })
        .then(function (response) {
          $scope.image.push(response.data);
          $scope.getImage();
        })
        .catch(function (error) {
          // Xử lý lỗi
          console.error("Error:", error);
          // Đoạn mã xử lý khi gặp lỗi trong quá trình gửi yêu cầu
        });
    };

    // Cleaned up code
    setTimeout(() => {
      $scope.deleteImage = function (id) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        Swal.fire({
          title: "Xác nhận xóa?",
          text: "Bạn có chắc chắn muốn xóa ảnh này ?",
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
              .delete(
                "http://localhost:8080/api/v1/images/remove?id=" + id,
                token
              )
              .then(function () {
                var index = $scope.image.findIndex((img) => img.id === id);
                if (index !== -1) {
                  $scope.image.splice(index, 1);
                }
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Xóa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                });
              });
          }
        });
      };
    }, 2000);

    setTimeout(() => {
      $scope.updateQuantity = function (id, soLuong) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        var apiURL =
          "http://localhost:8080/api/v1/san-pham-chi-tiet/update-quantity?id=" +
          id +
          "&soLuong=" +
          soLuong;
        $http({
          url: apiURL,
          method: "PUT",
          headers: config.headers,
          transformResponse: [
            function () {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Thành công",
                showConfirmButton: false,
                timer: 1500,
              });
              $scope.getProductDetail();
            },
          ],
        });
      };
    }, 2000);

    $scope.generateQRCode = function (data) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http({
        method: "GET",
        headers: config.headers,
        url: "http://localhost:8080/api/qrcode/generate-product/" + data,
        responseType: "arraybuffer",
      }).then(
        function (response) {
          var blob = new Blob([response.data], { type: "image/png" });
          $scope.qrCodeImage = URL.createObjectURL(blob);
        },
        function (error) {
          console.error("Lỗi khi lấy hình ảnh QR code:", error);
        }
      );
    };
  }
);
