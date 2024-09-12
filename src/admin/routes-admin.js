myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/dashboard", {
      templateUrl: "./pages/thong-ke.html",
      controller: "thongKeController",
    })
    .when("/admin/login", {
      templateUrl: "./pages/authentication-login.html",
      controller: "loginController",
    })
    .when("/order-counter", {
      templateUrl: "./pages/bantaiquay.html",
      controller: "BanTaiQuayController",
    })
    .when("/order", {
      templateUrl: "./pages/thuchi.html",
      controller: "hoaDonController",
    })
    .when("/order-detail/:id", {
      templateUrl: "./pages/chi-tiet-hoa-don.html",
      controller: "hoaDonChiTietController",
    })
    .when("/promotion", {
      templateUrl: "./pages/khuyen-mai-sp.html",
      controller: "GiamGiaController",
    })
    .when("/promotion/create", {
      templateUrl: "./pages/create-giam-gia-san-pham.html",
      controller: "GiamGiaController",
    })
    .when("/promotion/product", {
      templateUrl: "./pages/khuyen-mai-ap-dung.html",
      controller: "giamgiaChiTietController",
    })
    .when("/promotion/update/:id", {
      templateUrl: "./pages/update-giam-gia-sanpham.html",
      controller: "giamgiaChiTietController",
    })
    .when("/promotion/detail/:id", {
      templateUrl: "./pages/khuyen-mai-chi-tiet.html",
      controller: "khuyenMaiChiTietController",
    })
    .when("/voucher", {
      templateUrl: "./pages/voucher-hoa-don.html",
      controller: "VoucherController",
    })
    .when("/voucher/create", {
      templateUrl: "./pages/create-chuong-trinhkm.html",
      controller: "VoucherController",
    })
    .when("/voucher/update/:id", {
      templateUrl: "./pages/update-chuong-trinhkm.html",
      controller: "voucherChiTietController",
    })
    .when("/customer", {
      templateUrl: "./pages/khach-hang.html",
      controller: "khachHangController",
    })
    .when("/customer/update/:id", {
      templateUrl: "./pages/update-khach-hang.html",
      controller: "UpdateKhachHangController",
    })
    .when("/staff/update/:id", {
      templateUrl: "./pages/update-nhan-vien.html",
      controller: "UpdateNhanVienController",
    })
    .when("/staff", {
      templateUrl: "./pages/nhan-vien.html",
      controller: "nhanVienController",
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
    .when("/origin", {
      templateUrl: "./pages/xuat-xu.html",
      controller: "xuatXuController",
    })
    .when("/brand", {
      templateUrl: "./pages/thuong-hieu.html",
      controller: "thuongHieuController",
    })
    .when("/size", {
      templateUrl: "./pages/size.html",
      controller: "sizeController",
    })
    .when("/color", {
      templateUrl: "./pages/mau-sac.html",
      controller: "mauSacController",
    })
    .when("/sole", {
      templateUrl: "./pages/kieu-de.html",
      controller: "kieuDeController",
    })
    .when("/material", {
      templateUrl: "./pages/chat-lieu.html",
      controller: "chatLieuController",
    })
    .when("/category", {
      templateUrl: "./pages/danh-muc.html",
      controller: "danhMucController",
    })
    .when("/transaction-done", {
      templateUrl: "./pages/vnpay-done.html",
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
