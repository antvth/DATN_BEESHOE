clientApp.controller('shopControllers',
    function ($scope, $http, $window) {

        $window.scrollTo(0, 0)

        // pricing filter
        var rangeSlider = $(".price-range"), amount = $("#amount")

        // list product
        $scope.listBrands = []
        $scope.listTypes = []
        $scope.listColors = []
        $scope.listSizes = []

        // get list product
        $scope.listBrandChoose = []
        $scope.listTypeChoose = []
        $scope.listColorChoose = []
        $scope.listSizeChoose = []

        // list product detail
        $scope.productDetails = []
        $scope.products = []

        $scope.loadSizes = () => {
            $http.get('http://localhost:8080/size/get-all')
                .then(function (response) {
                    $scope.sizes = response.data
                });
        }

        $scope.loadProductDetails = () => {
            $http.get('http://localhost:8080/product-detail/get-all?size=1000&page=0').then(function (response) {
                $scope.productDetails = response.data
                var temp = []
                var minPrice = rangeSlider.slider("values", 0);
                var maxPrice = rangeSlider.slider("values", 1);

                if ($scope.listBrandChoose.length == 0 && $scope.listTypeChoose.length == 0 && $scope.listColorChoose.length == 0 && $scope.listSizeChoose.length == 0) {
                    $scope.productDetails.content.forEach(e => {
                        temp.push(e)
                    })
                } else {
                    temp = []
                }

                if ($scope.listBrandChoose.length !== 0) {
                    if (temp.length == 0) {
                        response.data.content.forEach(e => {
                            $scope.listBrandChoose.forEach(brand => {
                                if (e.idSanPham.idThuongHieu.id == brand) {
                                    temp.push(e)
                                }
                            })
                        })
                    } else {
                        var list = []
                        temp.forEach(e => {
                            $scope.listBrandChoose.forEach((brand, index) => {
                                if (e.idSanPham.idThuongHieu.id == brand) {
                                    list.push(e)
                                }
                            })
                        })

                        temp = list
                    }
                }

                if ($scope.listTypeChoose.length !== 0) {
                    if (temp.length == 0) {
                        response.data.content.forEach(e => {
                            $scope.listTypeChoose.forEach(type => {
                                if (e.idSanPham.idTheLoai.id == type) {
                                    temp.push(e)
                                }
                            })
                        })
                    } else {
                        var list = []
                        temp.forEach(e => {
                            $scope.listTypeChoose.forEach((type, index) => {
                                if (e.idSanPham.idTheLoai.id == type) {
                                    list.push(e)
                                }
                            })
                        })

                        temp = list;
                    }
                }

                if ($scope.listColorChoose.length !== 0) {
                    if (temp.length == 0) {
                        response.data.content.forEach(e => {
                            $scope.listColorChoose.forEach(color => {
                                if (e.idMauSac.id == color) {
                                    temp.push(e)
                                }
                            })
                        })
                    } else {
                        var list = []
                        temp.forEach((e, index) => {
                            $scope.listColorChoose.forEach(color => {
                                if (e.idMauSac.id == color) {
                                    list.push(e)
                                }
                            })

                        })

                        temp = list
                    }
                }

                if ($scope.listSizeChoose.length !== 0) {
                    if (temp.length == 0) {
                        response.data.content.forEach(e => {
                            $scope.listSizeChoose.forEach(size => {
                                if (e.idKichCo.id == size) {
                                    temp.push(e)
                                }
                            })
                        })
                    } else {
                        var list = []
                        temp.forEach(e => {
                            $scope.listSizeChoose.forEach(size => {
                                if (e.idKichCo.id == size) {
                                    list.push(e)
                                }
                            })
                        })
                        temp = list
                    }
                }

                if (temp.length == 0) {
                    response.data.content.forEach(e => {
                        if (e.donGia >= minPrice && e.donGia <= maxPrice) {
                            temp.push(e)
                        }
                    })
                } else {
                    var list = []
                    temp.forEach(e => {
                        if (e.donGia >= minPrice && e.donGia <= maxPrice) {
                            list.push(e)
                        }
                    })
                    temp = list
                }

                setTimeout(() => {
                    var setProductDetail = new Set()
                    temp.forEach(e => {
                        setProductDetail.add(e.idSanPham.id)
                    })

                    $scope.products = []
                    setProductDetail = Array.from(setProductDetail)
                    setProductDetail.forEach(e => {
                        var product = temp.find(x => x.idSanPham.id == e)
                        if (product != undefined) {
                            $scope.products.push(product)
                        }
                    })
                    $scope.loadSizes()

                }, 100);
            }).catch(function (error) {
                console.log(error)
            })
        }

        rangeSlider.slider({
            slide: function (event, ui) {
                amount.val($scope.formatToVND(ui.values[0]) + " - " + $scope.formatToVND(ui.values[1]));
                $scope.loadProductDetails()
            }
        });

        $scope.loadData = () => {
            $http.get('http://localhost:8080/product/get-quantity-of-product-by-brand').then(function (response) {
                $scope.listBrands = response.data
            }).catch(function (error) {
                console.log(error)
            })

            $http.get('http://localhost:8080/product/get-quantity-of-product-by-color').then(function (response) {
                $scope.listColors = response.data
            }).catch(function (error) {
                console.log(error)
            })

            $http.get('http://localhost:8080/product/get-quantity-of-product-by-size').then(function (response) {
                $scope.listSizes = response.data
            }).catch(function (error) {
                console.log(error)
            })

            $http.get('http://localhost:8080/product/get-quantity-of-product-by-type').then(function (response) {
                $scope.listTypes = response.data
            }).catch(function (error) {
                console.log(error)
            })

        }

        $scope.loadProductDetails()

        $scope.loadData()

        $scope.chooseSize = (id) => {
            var check = document.getElementById("size_product_" + id).checked
            if (check == true) {
                document.getElementById("size_product_" + id).checked = true;
                $scope.listSizeChoose.push(id)
            } else {
                $scope.listSizeChoose.splice($scope.listSizeChoose.indexOf(id), 1);
                document.getElementById("size_product_" + id).checked = false;
                $scope.listSizeChoose = $scope.listSizeChoose.filter(x => x !== id)
            }

            $scope.loadProductDetails()
        }

        $scope.chooseType = (id) => {
            var check = document.getElementById("type_product_" + id).checked
            if (check == true) {
                document.getElementById("type_product_" + id).checked = true;
                $scope.listTypeChoose.push(id)
            } else {
                $scope.listTypeChoose.splice($scope.listTypeChoose.indexOf(id), 1);
                document.getElementById("type_product_" + id).checked = false;
                $scope.listTypeChoose = $scope.listTypeChoose.filter(x => x !== id)
            }

            $scope.loadProductDetails()
        }

        $scope.chooseColor = (id) => {
            var check = document.getElementById("color_product_" + id).checked
            if (check == true) {
                document.getElementById("color_product_" + id).checked = true;
                $scope.listColorChoose.push(id)
            } else {
                $scope.listColorChoose.splice($scope.listColorChoose.indexOf(id), 1);
                document.getElementById("color_product_" + id).checked = false;
                $scope.listColorChoose = $scope.listColorChoose.filter(x => x !== id)
            }

            $scope.loadProductDetails()
        }

        $scope.chooseBrand = (id) => {
            var check = document.getElementById("brand_product_" + id).checked
            if (check == true) {
                document.getElementById("brand_product_" + id).checked = true;
                $scope.listBrandChoose.push(id)
            } else {
                $scope.listBrandChoose.splice($scope.listBrandChoose.indexOf(id), 1);
                document.getElementById("brand_product_" + id).checked = false;
                $scope.listBrandChoose = $scope.listBrandChoose.filter(x => x !== id)
            }

            $scope.loadProductDetails()
        }

        $scope.formatToVND = function (amount) {
            const formatter = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0, // Set to 0 to display whole numbers
            });
            return formatter.format(amount);
        }

        $scope.getAllImagesByIDProductDetail = function (id) {
            var html = document.getElementById("image-" + id);
            axios.get('http://localhost:8080/image/get-all/' + id).then(function (response) {
                html.src = response.data[0].duongDan
            }).catch(function (error) {
                console.log(error)
            })
        }

    });