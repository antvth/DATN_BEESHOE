clientApp.controller('singleProductController',
    function ($scope, $http, $routeParams) {
        window.scrollTo(0, 0)
        var id = $routeParams.id
        var today = new Date();
        $scope.productDetails = []
        $scope.product = {}

        $scope.customer = JSON.parse(localStorage.getItem("user"))

        // entity
        $scope.colorProductDetails = []
        $scope.productDetailChooses = []

        // current entity
        $scope.productChooseCurrent = {}

        // images current
        $scope.imageCurrents = []

        // currentPage
        $scope.currentPageProductDetail = 1;
        $scope.itemsPerPageProductDetail = 100;
        $scope.quantity_of_cart = 1;

        // cart detail
        $scope.cartDetails = []

        $scope.loadSizes = () => {
            $http.get('http://localhost:8080/size/get-all')
                .then(function (response) {
                    $scope.sizes = response.data
                });

            if ($scope.productChooseCurrent != null && $scope.productChooseCurrent != undefined) {
                if ($scope.customer != null) {
                    $http.get('http://localhost:8080/cart/get-cart-detail-by-id-cart?id_customer=' + $scope.customer.id + '&id_product_detail=' + $scope.productChooseCurrent.id).then(response => {
                        $scope.cartDetails = response.data
                    }).catch(error => {
                        console.log(error)
                    })
                } else {
                    $http.get('http://localhost:8080/cart/get-cart-detail-by-id-cart?id_customer=' + -1 + '&id_product_detail=' + $scope.productChooseCurrent.id).then(response => {
                        $scope.cartDetails = response.data
                    }).catch(error => {
                        console.log(error)
                    })
                }

            }
        }

        $scope.formatToVND = function (amount) {
            const formatter = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0, // Set to 0 to display whole numbers
            });
            return formatter.format(amount);
        }

        $scope.loadData = function () {
            var colorHtml = document.getElementById("color-product-detail")
            colorHtml.innerHTML = ""

            $http.get('http://localhost:8080/product-detail/find-all-panigation?page=' + ($scope.currentPageProductDetail - 1) + '&size=' + $scope.itemsPerPageProductDetail + '&trang_thai=' + '&idSize=' + '&idColor=' + '&id=' + id,)
                .then(function (response) {
                    $scope.productDetails = response.data.content
                    $scope.product = response.data.content[0].idSanPham
                    $scope.totalItemsProductDetail = response.data.totalElements
                }).catch(function (error) {
                    console.log(error)
                });

            $http.get('http://localhost:8080/product-detail/get-color-identity/' + id)
                .then(function (response) {
                    $scope.colorProductDetails = response.data
                    console.log(response.data)
                    var text = ""
                    response.data.forEach(color => {
                        text += `
                        <button data-tooltip="${color.ten}" id="color-product-detail-${color.id}" class="color-product-detail"
                                onclick="angular.element(this).scope().chooseColor(${color.id})"
                                style="background-image: url(${color.duongDan});display:inline-block;postition: relative;
                                width: 100px;height: 67px;background-size: cover;border-radius: 5px;margin-right: 10px;margin-bottom: 10px;">
                               
                                <div class="background-product">
                                  <i class="ti ti-checks icon-product"></i>    
                                </div>
                        </button>
                        `
                    });
                    colorHtml.innerHTML = text;
                    setTimeout(() => {
                        $scope.chooseColor(response.data[0].id)
                    }, 10)
                }).catch(function (error) {
                    console.log(error)
                });

            $http.get('http://localhost:8080/product-detail/get-product-newests').then(response => {
                $scope.productNewests = response.data
            }).catch(error => {
                console.log(error)
            })

            $scope.loadCartDetails();

        }

        $scope.loadCartDetails = () => {
            if ($scope.productChooseCurrent != null && $scope.productChooseCurrent != undefined) {
                if ($scope.customer != null) {
                    $http.get('http://localhost:8080/cart/get-cart-detail-by-id-cart?id_customer=' + $scope.customer.id + '&id_product_detail=' + $scope.productChooseCurrent.id).then(response => {
                        $scope.cartDetails = response.data
                    }).catch(error => {
                        console.log(error)
                    })
                } else {
                    $http.get('http://localhost:8080/cart/get-cart-detail-by-id-cart?id_customer=' + -1 + '&id_product_detail=' + $scope.productChooseCurrent.id).then(response => {
                        $scope.cartDetails = response.data
                    }).catch(error => {
                        console.log(error)
                    })
                }

            }
        }

        $scope.getImageByProductId = function (id) {
            axios.get('http://localhost:8080/image/get-all/' + id).then(function (response) {
                return response.data[0].duongDan
            }).catch(function (error) {
                console.log(error)
            })
        }

        $scope.clearMarkColor = () => {
            var colorHtml = document.getElementById("color-product-detail").getElementsByTagName("button")

            for (e of colorHtml) {
                e.classList.remove("color-product-detail-active")
                e.classList.add("color-product-detail")
            }
        }

        $scope.clearMarkSize = () => {
            var sizeHtml = document.getElementById("size-product-detail").getElementsByTagName("button")

            for (e of sizeHtml) {
                e.classList.remove("size-product-detail-active")
                e.classList.add("size-product-detail")
            }
        }

        $scope.chooseColor = (id) => {
            // clear mark
            $scope.clearMarkColor();

            // active current choose color
            var currentColor = document.getElementById("color-product-detail-" + id)
            currentColor.classList.add("color-product-detail-active")
            currentColor.classList.remove("color-product-detail")

            $scope.productDetailChooses = $scope.productDetails.filter(productDetail => productDetail.idMauSac.id === id)
            $scope.loadSizes()
            console.log($scope.productDetailChooses)

            setTimeout(() => {
                $scope.productDetailChooses.forEach((productDetail, index) => {
                    if (productDetail.soLuongTon > 0) {
                        $scope.chooseSize(productDetail)
                        return
                    } else {
                        $scope.productChooseCurrent = productDetail
                        return;
                    }
                })
            }, 10)

        }

        $scope.chooseSize = (productDetail) => {
            $scope.clearMarkSize()

            // active current choose color
            var currentSize = document.getElementById("size-product-detail-" + productDetail.idKichCo.id)
            currentSize.classList.add("size-product-detail-active")
            currentSize.classList.remove("size-product-detail")

            $scope.productChooseCurrent = productDetail
            setTimeout(() => {
                $scope.loadCartDetails()
                $scope.getAllImagesBecomeSlides($scope.productChooseCurrent.id, 'product')
            }, 100)
        }

        $scope.getAllImagesByIDProductDetail = function (id) {
            axios.get('http://localhost:8080/image/get-all/' + id).then(function (response) {
                $scope.imageCurrents = response.data;
                $scope.loadSizes()
            }).catch(function (error) {
                console.log(error)
            })
        }

        $scope.getAllImagesBecomeSlides = function (id, text) {
            var textFist = `
            <div id="carousel-${id}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                
            `
            var textCenter = ''
            var textLast = `
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${id}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-${id}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </button>
            </div>
            `
            var html = document.getElementById("image-" + id)
            if (text !== undefined) {
                var html = document.getElementById("image-" + text + "-" + $scope.product.id)
            }

            axios.get('http://localhost:8080/image/get-all/' + id).then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (i == 0) {
                        textCenter += `
                            <div class="carousel-item active">
                                <img src="${response.data[i].duongDan}" class="d-block w-100" alt="...">
                            </div>`
                    } else {
                        textCenter += `
                            <div class="carousel-item">
                                <img src="${response.data[i].duongDan}" class="d-block w-100" alt="...">
                            </div>`
                    }

                }

                html.innerHTML = textFist + textCenter + textLast

            }).catch(function (error) {
                console.log(error)
            })
        }

        $scope.addToCart = () => {

            if ($scope.quantity_of_cart == 0) {
                toastr.error("Vui lý chọn số lượng mua")
                return
            }

            if ($scope.quantity_of_cart < 0) {
                toastr.error("Số lượng sản phẩm phải lớn hơn 0")
                return
            }

            if ($scope.cartDetails.length != 0) {

                if ($scope.quantity_of_cart + $scope.cartDetails[0].soLuong > 3) {
                    Swal.fire({
                        icon: "error",
                        title: "Xin lỗi vì sự bất tiện này!!",
                        text: "Bạn không thể đặt hàng quá 3 sản phẩm. Vui lòng liên hệ 0968686868 biết thêm chi tiết.",
                    });
                    return
                }

                if ($scope.productChooseCurrent.soLuongTon < $scope.quantity_of_cart + $scope.cartDetails[0].soLuong) {
                    toastr.error("Số lượng còn lại trong kho không đủ.Vui lòng chọn sản phẩm khác.")
                    return
                }
            } else {
                if ($scope.quantity_of_cart > 3) {
                    Swal.fire({
                        icon: "error",
                        title: "Xin lỗi vì sự bất tiện này!!",
                        text: "Bạn không thể đặt hàng quá 3 sản phẩm. Vui lòng liên hệ 0968686868 biết thêm chi tiết.",
                        footer: '<a href="#">Why do I have this issue?</a>'
                    });
                    return
                }

                if ($scope.productChooseCurrent.soLuongTon < $scope.quantity_of_cart) {
                    toastr.error("Số lượng còn lại trong kho không đủ.Vui lòng chọn sản phẩm khác.")
                    return
                }

            }

            $http.post('http://localhost:8080/cart/add-to-cart-quantity', {
                sanPhamChiTiet: $scope.productChooseCurrent,
                soLuong: $scope.quantity_of_cart == 1 ? -1 : $scope.quantity_of_cart,
                idKhachHang: $scope.customer == null ? -1 : $scope.customer.id
            }).then(function (response) {
                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": false,
                    "positionClass": "toast-bottom-right",
                    "preventDuplicates": false,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                toastr.success("Thêm vào giỏ hàng thành công")
                setTimeout(() => {
                    loadQuantityByIdProduct(-1)
                    $scope.showMiniCart()
                    $scope.loadSizes()
                    $scope.getAllImagesBecomeSlides($scope.productChooseCurrent.id, 'product')
                }, 300)

            }).catch(function (error) {
                toastr.error(error.data.message)
            })

        }

        $scope.minusQuantity = () => {
            if ($scope.quantity_of_cart > 1) {
                $scope.quantity_of_cart -= 1
            } else {
                $scope.quantity_of_cart = 1
            }
        }

        $scope.plusQuantity = () => {
            $scope.quantity_of_cart += 1
        }

        $scope.changeQuantity = () => {
            if ($scope.quantity_of_cart < 0) {
                $scope.quantity_of_cart = 0
            }
        }

        $scope.getAllImagesByIDProductDetailSwiper = function (id) {
            var html = document.getElementById("image-" + id);
            axios.get('http://localhost:8080/image/get-all/' + id).then(function (response) {
                html.src = response.data[0].duongDan
            }).catch(function (error) {
                console.log(error)
            })
        }

        $scope.changeQuantity = (cartDetail) => {
            if (cartDetail.soLuong > 3) {
                cartDetail.soLuong = 3
            }

            if (cartDetail.soLuong < 1) {
                cartDetail.soLuong = 1
            }
        }

        $scope.loadData()

    });