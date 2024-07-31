clientApp.controller('registerController',
    function ($scope, $http, $window) {
        // id
        $scope.user = {};
        $scope.passAgain = "";

        // REGEX
        var phone_regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        $scope.register = () => {

            if (
                $scope.user.ten == ""
                || $scope.user.ten == null
                || $scope.user.ten == undefined) {
                toastr.error('Bạn phải nhập tên')
                return;
            }

            if (
                $scope.user.email == ""
                || $scope.user.email == null
                || $scope.user.email == undefined) {
                toastr.error('Bạn phải nhập email')
                return;
            }

            if (
                $scope.user.matKhau == ""
                || $scope.user.matKhau == null
                || $scope.user.matKhau == undefined) {
                toastr.error('Bạn phải nhập mật khẩu ')
                return;
            }

            if (
                $scope.passAgain == ""
                || $scope.passAgain == null
                || $scope.passAgain == undefined) {
                toastr.error('Bạn phải nhập trường nhập lại mật khẩu ')
                return;
            }

            if (!email_regex.test($scope.user.email)) {
                toastr.error('Bạn phải nhập đúng định dạng email')
                return;
            }

            if ($scope.user.matKhau !== $scope.passAgain) {
                toastr.error('Bạn phải nhập đúng mật khẩu vừa nhập')
                return;
            }


            Swal.fire({
                title: "Xác nhận đăng kí",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post('http://localhost:8080/customer/register', $scope.user).then(function (response) {
                        toastr.success("Đăng kí thành công")
                        $window.location.href = "#!dang-nhap"
                    })
                        .catch(function (response) {
                            toastr.error(response.response.data.message)
                        })
                }
            }
            )
        }


    });