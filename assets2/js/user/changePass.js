clientApp.controller('changePassController',
    function ($scope, $http, $window) {
        // id
        $scope.oldPass = ""
        $scope.newPass = ""
        $scope.newPassAgain = ""
        $scope.customer = JSON.parse(localStorage.getItem("user"));

        $scope.changePass = () => {
            if ($scope.oldPass == "" ||
                $scope.newPass == "" ||
                $scope.newPassAgain == "") {
                toastr.error('Vui lòng nhập đủ thông tin')
                return;
            }

            if($scope.newPass !== $scope.newPassAgain){
                toastr.error('Vui lòng nhập đúng mật khẩu')
                return;
            }

            if($scope.customer.matKhau == $scope.oldPass){
                toastr.error('Mật khẩu cũ không đúng.Vui lòng nhập lại.')
                return;
            }

            $scope.customer.matKhau = $scope.newPass
            Swal.fire({
                title: "Xác nhận đổi mật khẩu?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post("http://localhost:8080/customer/change-pass?id=" + $scope.customer.id + "&pass=" + $scope.newPass)
                        .then((res) => {
                            toastr.success("Thay đổi thành công")
                            setTimeout(() => {
                                $window.location.href = "#!trang-chu"
                            }, 200);
                        })
                        .catch((error) => console.error("Error:", error));

                }
            });


        }



    });