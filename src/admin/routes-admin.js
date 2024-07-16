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
    .otherwise({
      redirectTo: "/dashboard",
    });
});
