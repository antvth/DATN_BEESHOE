clientApp.controller('successPaymentController',
    function ($scope, $http, $window) {
        $scope.bill = JSON.parse(localStorage.getItem("bill_vnpay"))
        $scope.cartDetails = JSON.parse(localStorage.getItem("bill_detail_vnpay"))


        $scope.loadData = () => {
            $http.get('http://localhost:8080/bill/get-bill-by-code/' + $scope.bill.ma).then(function (response) {
            }).catch(function (error) {
                $scope.bill.trangThai = 2
                $scope.bill.phuongThucThanhToan = 1
                axios.put('http://localhost:8080/bill/update-bill', $scope.bill).then(function (response) {

                    $scope.bill = response.data
                    axios.post('http://localhost:8080/history/add', {
                        'trangThai': 1,
                        'ghiChu': $scope.bill.ghiChu,
                        'hoaDon': response.data
                    }).then(function (response) {

                    }).catch(function (error) {
                        console.log(error);
                    })
                    axios.post('http://localhost:8080/history/add', {
                        'trangThai': 2,
                        'ghiChu': $scope.bill.ghiChu,
                        'hoaDon': response.data
                    }).then(function (response) {

                    }).catch(function (error) {
                        console.log(error);
                    })

                    axios.post("http://localhost:8080/payment-method/add", {
                        loaiThanhToan: 1,
                        soTienThanhToan: Number($scope.bill.tongTienSauGiam),
                        ghiChu: $scope.bill.ghiChu,
                        idHoaDon: $scope.bill,
                        deleted: true
                    }).then(function (response) {

                        setTimeout(() => {
                        }, 100);
                    }).catch(function (error) {
                        console.log(error)
                    })

                    $scope.cartDetails.forEach((x, index) => {

                        $http.post('http://localhost:8080/bill-detail/add-bill-detail-client', {
                            'hoaDon': response.data,
                            'sanPhamChiTiet': x.idSanPhamChiTiet,
                            'soLuong': x.soLuong
                        }).then(function (resp) {
                            $scope.removeCartDetail(x)
                            x.idSanPhamChiTiet.soLuongTon -= x.soLuong
                            axios.put('http://localhost:8080/product-detail/update-product-detail', x.idSanPhamChiTiet)
                                .then((resps) => {

                                }).catch((error) => {
                                    console.log(error)
                                })

                            if (index == $scope.cartDetails.length - 1) {
                                if ($scope.voucher != null) {
                                    $scope.voucher.soLanDung -= 1
                                    axios.put('http://localhost:8080/voucher/edit-voucher', $scope.voucher)
                                        .then((response) => {

                                            setTimeout(function () {
                                                axios.post("http://localhost:8080/email/send-email", $scope.bill).then(function (response) {

                                                }).catch(function (error) {

                                                })
                                                $scope.addBill()
                                                // $window.location.href = '#!chi-tiet-hoa-don/' + $scope.bill.id;
                                                // $window.location.reload();
                                                // window.scrollTo(0, 0);
                                            }, 500)
                                        }).catch((error) => {
                                            console.log(error)
                                        })
                                } else {

                                    setTimeout(function () {
                                        axios.post("http://localhost:8080/email/send-email", $scope.bill).then(function (response) {
                                        }).catch(function (error) {
                                        })
                                        $scope.addBill()
                                        // $window.location.href = '#!chi-tiet-hoa-don/' + $scope.bill.id;
                                        // $window.location.reload();
                                    }, 500)
                                }
                            }
                        }).catch(function (error) {
                            toastr.error(error.data.message)
                            return;
                        })

                    })
                })
                    .catch(function (response) {
                        console.log(response.data)
                    })
            })


        }

        $scope.loadData()

        var socket = new SockJS("http://localhost:8080/ws");
        var stompClient = Stomp.over(socket);

        // stompClient.connect({}, function (frame) {
        //     console.log("Connected: " + frame);

        //     stompClient.subscribe("/bill/bills", function (message) {
        //         console.log(message.body);

        //         $scope.$apply();
        //     });
        // });

        $scope.addBill = function () {
            var message = {
                name: $scope.bill.ma,
            };

            stompClient.send("/app/bills", {}, JSON.stringify(message));
        };

        $scope.formatToVND = function (amount) {
            const formatter = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0, // Set to 0 to display whole numbers
            });
            return formatter.format(amount);
        }

        $scope.removeCartDetail = (e) => {
            axios.delete('http://localhost:8080/cart-detail/remove-cart-detail/' + e.id).then(function (response) {
            }).catch(function (error) {
                console.log(error)
            })
        }

    });