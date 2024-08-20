myAppCustom.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/home", {
      templateUrl: "./pages/home.html",
      controller: "homeController",
    })
    .when("/shop", {
      templateUrl: "./pages/shop-grid.html",
      controller: "sanPhamShopController",
    })
    .when("/shop/detail/:name", {
      templateUrl: "./pages/shop-details.html",
      controller: "sanPhamShopDetailController",
    })
    .when("/check-out", {
      templateUrl: "./pages/shoping-cart.html",
      controller: "CartController",
    })

    .when("/check-out2", {
      templateUrl: "./pages/shopcard-thanh-toan.html",
      controller: "CartController",
    })

    .when("/thank-you", {
      templateUrl: "./pages/thankyou.html",
      controller: "CartController",
    })
    .when("/thank-you2", {
      templateUrl: "./pages/thankyou2.html",
      controller: "CartController",
    })
    .when("/don-hang", {
      templateUrl: "./pages/don-hang.html",
      controller: "donHangController",
    })
    .when("/login", {
      templateUrl: "/src/customer/pages/login.html",
      controller: "loginCutomController",
    })
    .when("/register", {
      templateUrl: "/src/customer/pages/register.html",
      controller: "registerCutomController",
    })
    .when("/don-hang-chi-tiet/:idHoaDon", {
      templateUrl: "./pages/detail-don-hang.html",
      controller: "detailDonHangController",
    })
    .when("/dia-chi", {
      templateUrl: "./pages/dia-chi.html",
      controller: "DiaChiController",
    })
    .when("/lien-he", {
      templateUrl: "./pages/lien-he.html",
    })
    .when("/huong-dan", {
      templateUrl: "./pages/huong-dan.html",
    })
    .when("/chinh-sach-van-chuyen", {
      templateUrl: "./pages/chinh-sach-van-chuyen.html",
    })
    .when("/chinh-sach-bao-mat", {
      templateUrl: "./pages/chinh-sach-bao-mat.html",
    })
    .when("/chinh-sach-doi-tra", {
      templateUrl: "./pages/chinh-sach-doi-tra.html",
    })
    .when("/hinh-thuc-thanh-toan", {
      templateUrl: "./pages/hinh-thuc-thanh-toan.html",
    })
    .when("/chinh-sach-xu-ly-khieu-nai", {
      templateUrl: "./pages/chinh-sach-xu-ly-khieu-nai.html",
    })
    .when("/quen-mat-khau", {
      templateUrl: "./pages/forgot-password.html",
      controller: "QuenMatKhauController",
    })
    .when("/dat-lai-password/:id", {
      templateUrl: "./pages/dat-lai-mat-khau.html",
      controller: "DatLaiPassWordsController"
    })
    .otherwise({
      redirectTo: "/home",
    });
});
