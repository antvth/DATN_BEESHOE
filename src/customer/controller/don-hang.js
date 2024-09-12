myAppCustom.controller("donHangController", function ($http, $scope, $window) {

    $scope.username = $window.localStorage.getItem('username');
    console.log("username"+$window.localStorage.getItem('username'))

    // Hàm tự động click vào tab "Thành công" khi trang mới load
    $scope.selectTabThangCong = function () {
        // Sử dụng setTimeout để đảm bảo DOM đã được render trước khi tìm kiếm phần tử
        setTimeout(function () {
            // Sử dụng JavaScript thuần để tìm phần tử radio button của tab "Thành công"
            var tabThangCong = document.getElementById('tab2');

            // Kiểm tra xem radio button có tồn tại không
            if (tabThangCong) {
                // Tự động kích hoạt sự kiện click
                tabThangCong.click();
            }
        });
    };

    // Gọi hàm tự động click vào tab khi controller được khởi tạo
    $scope.selectTabThangCong();

    $scope.listDonHang2 = [];

    var token = $window.localStorage.getItem("token-customer");
    var config = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    $scope.hasOrders = false;
    $scope.loadDonHang = function (trangThai) {
        // Gọi API với trạng thái mới
        $http.get(`http://localhost:8080/api/v1/don-hang-khach-hang/filter?trangthai=${trangThai}`, config)
            .then(function (response) {
                $scope.listDonHang2 = response.data;
                $scope.hasOrders = $scope.listDonHang2.length > 0;
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
    };

    $scope.loadTraHang = function () {
        // Gọi API với trạng thái mới
        $http.get(`http://localhost:8080/api/v1/don-hang-khach-hang/load-tra-hang`, config)
            .then(function (response) {
                $scope.listDonHang2 = response.data;
                $scope.hasOrders = $scope.listDonHang2.length > 0;
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
    };

    $scope.loadDonHuy = function () {
        // Gọi API với trạng thái mới
        $http.get(`http://localhost:8080/api/v1/don-hang-khach-hang/load-don-huy`, config)
            .then(function (response) {
                $scope.listDonHang2 = response.data;
                $scope.hasOrders = $scope.listDonHang2.length > 0;
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
    };

    //////////////////
    /// SEARCH HERE///
    //////////////////
    var token = $window.localStorage.getItem("token-customer");
    var config = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    //Search 1
    $scope.searchQuery = ''; // Initialize search query
    $scope.searchOrders = function () {
        $http.get('http://localhost:8080/api/v1/don-hang-khach-hang/search', {
            params: {
                tensanpham: $scope.searchQuery,
                trangthai: "1",
                mahoadon: $scope.searchQuery // Set the default mahoadon value or modify as needed
            },
            ...config // Spread the config object here
        }).then(function (response) {
            $scope.listDonHang2 = response.data;
            console.log(response.data)
        }).catch(function (error) {
            console.error('Error fetching orders:', error);
        });
    };
    // close search1

    //Search 2
    $scope.searchQuery2 = ''; // Initialize search query
    $scope.searchOrders2 = function () {
        $http.get('http://localhost:8080/api/v1/don-hang-khach-hang/search', {
            params: {
                tensanpham: $scope.searchQuery2,
                trangthai: "2",
                mahoadon: $scope.searchQuery2 // Set the default mahoadon value or modify as needed
            },
            ...config // Spread the config object here
        }).then(function (response) {
            $scope.listDonHang2 = response.data;
            console.log(response.data)
        }).catch(function (error) {
            console.error('Error fetching orders:', error);
        });
    };
    // close search2

        //Search 3
        $scope.searchQuery3 = ''; // Initialize search query
        $scope.searchOrders3 = function () {
            $http.get('http://localhost:8080/api/v1/don-hang-khach-hang/search', {
                params: {
                    tensanpham: $scope.searchQuery3,
                    trangthai: "3",
                    mahoadon: $scope.searchQuery3 // Set the default mahoadon value or modify as needed
                },
                ...config // Spread the config object here
            }).then(function (response) {
                $scope.listDonHang2 = response.data;
                console.log(response.data)
            }).catch(function (error) {
                console.error('Error fetching orders:', error);
            });
        };
        // close search3

        //Search 4
        $scope.searchQuery4 = ''; // Initialize search query
        $scope.searchOrders4 = function () {
            $http.get('http://localhost:8080/api/v1/don-hang-khach-hang/search', {
                params: {
                    tensanpham: $scope.searchQuery4,
                    trangthai: "4",
                    mahoadon: $scope.searchQuery4 // Set the default mahoadon value or modify as needed
                },
                ...config // Spread the config object here
            }).then(function (response) {
                $scope.listDonHang2 = response.data;
                console.log(response.data)
            }).catch(function (error) {
                console.error('Error fetching orders:', error);
            });
        };
        // close search 4

        //Search 5
        $scope.searchQuery5 = ''; // Initialize search query
        $scope.searchOrders5 = function () {
            $http.get('http://localhost:8080/api/v1/don-hang-khach-hang/search', {
                params: {
                    tensanpham: $scope.searchQuery5,
                    trangthai: "5",
                    mahoadon: $scope.searchQuery5 // Set the default mahoadon value or modify as needed
                },
                ...config // Spread the config object here
            }).then(function (response) {
                $scope.listDonHang2 = response.data;
                console.log(response.data)
            }).catch(function (error) {
                console.error('Error fetching orders:', error);
            });
        };
        // close search 5

        //Search 6
        $scope.searchQuery6 = ''; // Initialize search query
        $scope.searchOrders6 = function () {
            $http.get('http://localhost:8080/api/v1/don-hang-khach-hang/search-don-huy', {
                params: {
                    tensanpham: $scope.searchQuery6,
                    mahoadon: $scope.searchQuery6 // Set the default mahoadon value or modify as needed
                },
                ...config // Spread the config object here
            }).then(function (response) {
                $scope.listDonHang2 = response.data;
                console.log(response.data)
            }).catch(function (error) {
                console.error('Error fetching orders:', error);
            });
        };
        // close search 6

            //Search 7
            $scope.searchQuery7 = ''; // Initialize search query
            $scope.searchOrders7 = function () {
                $http.get('http://localhost:8080/api/v1/don-hang-khach-hang/search-tra-hang', {
                    params: {
                        tensanpham: $scope.searchQuery7,
                        mahoadon: $scope.searchQuery7 // Set the default mahoadon value or modify as needed
                    },
                    ...config // Spread the config object here
                }).then(function (response) {
                    $scope.listDonHang2 = response.data;
                    console.log(response.data)
                }).catch(function (error) {
                    console.error('Error fetching orders:', error);
                });
            };
            // close search 7

});
