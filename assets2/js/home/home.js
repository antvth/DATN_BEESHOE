clientApp.controller('homeController',
    function ($scope, $http) {

        // entity
        $scope.productNewests = []
        $scope.productBestSellers = []
        $scope.productDetailsWithSale = []

        $scope.loadData = () => {
            $http.get('http://localhost:8080/product-detail/get-product-newests').then(response => {
                $scope.productNewests = response.data
            }).catch(error => {
                console.log(error)
            })

            $http.get('http://localhost:8080/product-detail/get-top-product-best-seller').then(response => {
                $scope.productBestSellers = response.data

            }).catch(error => {
                console.log(error)
            })

            $http.get('http://localhost:8080/product-detail/get-product-detail-with-sale').then(response => {
                $scope.productDetailsWithSale = response.data
                console.log(response.data)
            }).catch(error => {
                console.log(error)
            })
        }

        $scope.getAllImagesByIDProductDetail = function (id) {
            var htmls = document.getElementsByClassName("image-" + id);
            axios.get('http://localhost:8080/image/get-all/' + id).then(function (response) {
                for (var html of htmls) {
                    html.src = response.data[0].duongDan
                }
            }).catch(function (error) {
                console.log(error)
            })

        }

        $scope.loadData()

        $scope.formatToVND = function (amount) {
            const formatter = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0, // Set to 0 to display whole numbers
            });
            return formatter.format(amount);
        }

    });