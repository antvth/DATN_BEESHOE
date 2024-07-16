myApp.service("CartService", function ($http, $window) {
  this.idCartChiTiet = {};
  this.cartDetail = [];

  this.setIdCart = function (id) {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return $http
      .get("http://localhost:8080/api/v1/don-hang/id_cart?id=" + id, config)
      .then(
        function (response) {
          this.idCartChiTiet = response.data;
          return this.idCartChiTiet.id;
        }.bind(this)
      );
  };

  this.getIdCart = function () {
    return this.idCartChiTiet.id;
  };

  this.setIdCartDetail = function (id) {
    var token = $window.localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    return $http
      .get("http://localhost:8080/api/gio-hang-chi-tiet/fill-id?id=" + id, config)
      .then((response) => {
        this.cartDetail = response.data;
        this.idList = this.cartDetail.map((item) => {
          return item.id;
        });
      });
  };

  this.getIdCartDetail = function () {
    return this.idList;
  };

  var tongTienHang = 0;

  this.setTongTienHang = function(value) {
    tongTienHang = value;
  };

  this.getTongTienHang = function() {
    return tongTienHang;
  };
  
});
