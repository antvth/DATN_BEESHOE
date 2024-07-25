myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
 
    .when("/admin/login", {
      templateUrl: "./pages/authentication-login.html",
      controller: "loginController",
    })
    .when("/order-counter", {
      templateUrl: "./pages/bantaiquay.html",
      controller: "BanTaiQuayController",
    })
    .when("/admin/login", {
      templateUrl: "./pages/login-admin.html",
      controller: "loginController",
    })
    .when("/product/create", {
      templateUrl: "./pages/san-pham-new.html",
      controller: "sanPhamController",
    })
    .when("/product-detail/:id", {
      templateUrl: "./pages/sanphamchitiet.html",
      controller: "sanPhamChiTietController",
    })
    .when("/product-detail/create/:id", {
      templateUrl: "./pages/them-san-pham-chi-tiet.html",
      controller: "sanPhamChiTietCreateController",
    })
    .when("/product", {
      templateUrl: "./pages/san-pham.html",
      controller: "sanPhamController",
    })
    .when("/product-update/:id", {
      templateUrl: "./pages/san-pham-update.html",
      controller: "sanPhamUpdateController",
    })
    .when("/order", {
      templateUrl: "./pages/thuchi.html",
      controller: "hoaDonController",
    })
    .otherwise({
      redirectTo: "/dashboard",
    });
});
