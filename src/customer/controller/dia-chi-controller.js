myAppCustom.controller("DiaChiController", function ($scope, $window, $http, $timeout) {

    // Tạo một hàm để gọi API lấy thông tin tài khoản
    $scope.loadProfile = function () {
        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        var api = "http://localhost:8080/api/v1/account/profile";

        $http.get(api, config).then(function (response) {
            response.data.ngaySinh = new Date(response.data.ngaySinh);
            $scope.taiKhoan = response.data;
            // Load dữ liệu lên giao diện
            loadDiaChi();
            $window.localStorage.setItem('username', $scope.taiKhoan.username);
            $window.localStorage.setItem('sodienthoai', $scope.taiKhoan.soDienThoai);
            $window.localStorage.setItem('email', $scope.taiKhoan.email);
            console.log("username" + $window.localStorage.getItem('username'))
            console.log("sodienthoai" + $window.localStorage.getItem('sodienthoai'))
            console.log("email" + $window.localStorage.getItem('email'))

        });

    };
    // Hàm để load thông tin địa chỉ
    function loadDiaChi() {
        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        var diaChiApi = "http://localhost:8080/api/v1/account/dia-chi";

        $http.get(diaChiApi, config).then(function (response) {
            $scope.diaChiList = response.data;
            console.log($scope.diaChiList);
            // Bạn có thể sử dụng $scope.diaChiList để hiển thị trên giao diện
        });
    }

    $scope.isDiaChiValid = true;
    // Gọi hàm khi trang được tải
    $scope.loadProfile();
    $scope.submitAddress = function () {
        $scope.isDiaChiValid = !!$scope.addressName;

        if (!$scope.isDiaChiValid) {
            Swal.fire({
                title: "",
                text: "Vui lòng điền đủ thông tin",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
        // Sử dụng SweetAlert2 cho hộp thoại xác nhận
        Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn thêm địa chỉ mới không?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                var token = $window.localStorage.getItem("token-customer");
                var config = {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                };

                var diaChiApi = "http://localhost:8080/api/v1/account/create-dia-chi";
                var requestData = {
                    diaChi: $scope.addressName
                };

                $http.post(diaChiApi, requestData, config).then(
                    function (response) {
                        // Xử lý phản hồi nếu cần
                        console.log(response.data);

                    },
                    function (error) {
                        // Xử lý lỗi nếu cần
                        console.error(error);
                    }
                );

                // Hiển thị thông báo thành công
                Swal.fire({
                    title: "",
                    text: "Thêm địa chỉ thành công",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                });

                // Chờ 1.5 giây rồi reload trang
                $timeout(function () {
                    $window.location.reload();
                }, 1500);
            }
        });
    };

    $scope.prepareUpdateAddress = function (diaChi) {
        console.log('Preparing to update address:', diaChi);
        $scope.updateAddressName = diaChi.diaChi;
        // Lưu ID của địa chỉ cần cập nhật để sử dụng trong submit
        $scope.updateAddressId = diaChi.id; // Đảm bảo rằng đây là ID của địa chỉ
    };
    $scope.isDiaChiValid2 = true;
    // Trong controller Angular của bạn
    $scope.updateAddress = function () {

        $scope.isDiaChiValid2 = !!$scope.updateAddressName;
        if (!$scope.isDiaChiValid2) {
            Swal.fire({
                title: "Warning",
                text: "Vui lòng điền đủ thông tin",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        var updatedData = {
            diaChi: $scope.updateAddressName
        };

        console.log(updatedData);
        // Gửi yêu cầu cập nhật địa chỉ
        $http.put('http://localhost:8080/api/v1/account/update-dia-chi/' + $scope.updateAddressId, updatedData, config)
            .then(function (response) {
            })
            .catch(function (error) {
            });
        Swal.fire({
            title: "Success",
            text: "cập nhật thành công",
            icon: "success",
            position: "bottom-start", // Đặt vị trí ở góc trái
            toast: true, // Hiển thị thông báo nhỏ
            showConfirmButton: false, // Ẩn nút xác nhận
            timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
        // Chờ 1.5 giây rồi reload trang
        $timeout(function () {
            $window.location.reload();
        }, 1500);
    };

    //set default
    $scope.setAsDefault = function (diaChi) {
        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        // Gọi API hoặc thực hiện các thay đổi cần thiết để đặt địa chỉ này làm mặc định
        // Dưới đây là một ví dụ sử dụng $http để gửi yêu cầu PUT đặt địa chỉ làm mặc định
        $http({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/account/set-default-dia-chi/' + diaChi.id,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(function (response) {
                // Xử lý khi cập nhật thành công
                console.log(response.data);
            })
            .catch(function (error) {
                // Xử lý khi cập nhật thất bại
                console.error(error.data);
            });

        Swal.fire({
            title: "Success",
            text: "thành công",
            icon: "success",
            position: "bottom-start", // Đặt vị trí ở góc trái
            toast: true, // Hiển thị thông báo nhỏ
            showConfirmButton: false, // Ẩn nút xác nhận
            timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
        // Chờ 1.5 giây rồi reload trang
        $timeout(function () {
            $window.location.reload();
        }, 1500);
    };
    // validation here
    $scope.isHoTenValid = true;
    $scope.isSoDienThoaiValid = true;
    $scope.isEmailValid = true;
    $scope.isNgaySinhValid = true;

    $scope.isSoDienThoaiIsPresent = true;
    $scope.isEmailIsPresent = true;

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
    $scope.updateProfile = function () {

        $scope.isHoTenValid = !!$scope.taiKhoan.hoTen;
        $scope.isSoDienThoaiValid = !!$scope.taiKhoan.soDienThoai;
        $scope.isEmailValid = !!$scope.taiKhoan.email;
        $scope.isNgaySinhValid = !!$scope.taiKhoan.ngaySinh;

        if (!$scope.isHoTenValid || !$scope.isSoDienThoaiValid || !$scope.isEmailValid || !$scope.isNgaySinhValid) {
            Swal.fire({
                title: "Warning",
                text: "Vui lòng điền đủ thông tin ",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        if ($scope.taiKhoan.soDienThoai) {
            $scope.isSoDienThoaiFormat = validateSoDienThoaiFormat($scope.taiKhoan.soDienThoai);
            if (!$scope.isSoDienThoaiFormat) {
                Swal.fire({
                    title: "Warning",
                    text: "Vui lòng kiểm tra định dạng số điện thoại ",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
        }
        if ($scope.taiKhoan.email) {
            $scope.isEmailFormat = validateEmailFormat($scope.taiKhoan.email);
            if (!$scope.isEmailFormat) {
                Swal.fire({
                    title: "Warning",
                    text: "Vui lòng kiểm tra định dạng email ",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
        }
        // Sử dụng SweetAlert2 cho hộp thoại xác nhận
        Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn cập nhật thông tin tài khoản không?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                var token = $window.localStorage.getItem("token-customer");
                var config = {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                };

                var updateProfileApi = "http://localhost:8080/api/v1/account/update-profile";

                // Tạo một đối tượng chứa thông tin cần cập nhật
                var updatedProfileData = {
                    hoTen: $scope.taiKhoan.hoTen,
                    soDienThoai: $scope.taiKhoan.soDienThoai,
                    email: $scope.taiKhoan.email,
                    ngaySinh: $scope.taiKhoan.ngaySinh,
                    gioiTinh: $scope.taiKhoan.gioiTinh
                };

                $http.put(updateProfileApi, updatedProfileData, config)
                    .then(function (response) {
                        // Xử lý khi cập nhật thành công
                        console.log(response.data);
                        // Cập nhật lại thông tin tài khoản trên giao diện
                        $scope.loadProfile();
                        // Tắt chế độ chỉnh sửa
                        $scope.editMode = false;
                    })
                    .catch(function (error) {
                        // Xử lý khi cập nhật thất bại
                        console.error(error.data);
                    });

                // Hiển thị thông báo thành công
                Swal.fire({
                    title: "",
                    text: "Cập nhật thành công",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                });

                // Chờ 1.5 giây rồi reload trang
                $timeout(function () {
                    $window.location.reload();
                }, 1500);
            }
        });
    };

    // Hàm để hủy bỏ cập nhật và tắt chế độ chỉnh sửa
    $scope.cancelUpdate = function () {
        // Tắt chế độ chỉnh sửa
        $scope.editMode = false;
        // Load lại thông tin tài khoản để hiển thị dữ liệu gốc
        $scope.loadProfile();
    };

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
});
