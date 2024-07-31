clientApp.controller('loginController',
    function ($scope, $http, $window) {
        // id
        $scope.user = {};
        var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        $scope.login = () => {

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

            if (!email_regex.test($scope.user.email)) {
                toastr.error('Bạn phải nhập đúng định dạng email')
                return;
            }

            axios.get('http://localhost:8080/customer/login?user=' + $scope.user.email + '&pass=' + $scope.user.matKhau).then(function (response) {
                localStorage.setItem("user", JSON.stringify(response.data));
                $window.location.href = "#!trang-chu"
                $window.location.reload()
            })
            .catch(function (error) {
                toastr.error(error.response.data.message)
            })
        }

    });