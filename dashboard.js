myApp.controller("thongKeController", function ($scope, $http, $window) {
  var role = $window.localStorage.getItem("role");
  if (role === "STAFF") {
    Swal.fire({
      icon: "error",
      title: "Bạn không có quyền truy cập",
      text: "Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.",
    });
    window.history.back();
  }
  if (role === null) {
    Swal.fire({
      icon: "error",
      title: "Vui lòng đăng nhập",
      text: "Vui lòng đăng nhập để có thể sử dụng chức năng.",
    });
    window.location.href =
      "http://127.0.0.1:5505/src/admin/index-admin.html#/admin/login";
  }

  $scope.isAdmin = false;
  function getRole() {
    if (role === "ADMIN") {
      $scope.isAdmin = true;
    }
  }

  getRole();
  $scope.loadData = function () {
    var token = $window.localStorage.getItem("token");
    console.log(token);
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    $http
      .get("http://localhost:8080/api/thong-ke/count-one", config)
      .then(function (response) {
        $scope.choXacNhan = response.data;
        return $http.get(
          "http://localhost:8080/api/thong-ke/count-two",
          config
        );
      })
      .then(function (response) {
        $scope.xacNhan = response.data;
        return $http.get(
          "http://localhost:8080/api/thong-ke/count-three",
          config
        );
      })
      .then(function (response) {
        $scope.choGiaoHang = response.data;
        return $http.get(
          "http://localhost:8080/api/thong-ke/count-four",
          config
        );
      })
      .then(function (response) {
        $scope.dangGiao = response.data;
        return $http.get(
          "http://localhost:8080/api/thong-ke/count-five",
          config
        );
      })
      .then(function (response) {
        $scope.thanhCong = response.data;
        return $http.get(
          "http://localhost:8080/api/thong-ke/count-six",
          config
        );
      })
      .then(function (response) {
        $scope.daHuy = response.data;
        updateChartData(
          $scope.choXacNhan,
          $scope.xacNhan,
          $scope.choGiaoHang,
          $scope.dangGiao,
          $scope.thanhCong,
          $scope.daHuy
        );
      })
      .catch(function (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      });
  };

  $scope.loadData();

  function updateChartData(
    choXacNhan,
    xacNhan,
    choGiaoHang,
    dangGiao,
    thanhCong,
    daHuy
  ) {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "Chờ xác nhận",
          "Xác nhận",
          "Chờ giao hàng",
          "Giao hàng",
          "Thành công",
          "Đã hủy",
        ],
        datasets: [
          {
            data: [
              choXacNhan,
              xacNhan,
              choGiaoHang,
              dangGiao,
              thanhCong,
              daHuy,
            ],
            backgroundColor: [
              "#03c6fc",
              "#1ff2cb",
              "#bdae4f",
              "#f21fdd",
              "#4efc03",
              "#f21f1f",
            ],
          },
        ],
      },
      options: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    });
  }
  var token = $window.localStorage.getItem("token");

  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  $scope.tongtienhomnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/tongtienhomnay", config)
    .then(function (response) {
      $scope.tongtienhomnay = response.data;
    });

  $scope.tongtientuannay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/tongtientuannay", config)
    .then(function (response) {
      $scope.tongtientuannay = response.data;
    });

  $scope.tongtiendonthangnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/tongtiendonthangnay", config)
    .then(function (response) {
      $scope.tongtiendonthangnay = response.data;
    });

  $scope.tongtiennamnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/tongtiennamnay", config)
    .then(function (response) {
      $scope.tongtiennamnay = response.data;
    });

  $scope.tongSoDonHnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-hom-nay", config)
    .then(function (response) {
      $scope.tongSoDonHnay = response.data;
    });

  $scope.tongSoDonTuanNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-tuan-nay", config)
    .then(function (response) {
      $scope.tongSoDonTuanNay = response.data;
    });

  $scope.tongSoDonThangNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-thang-nay", config)
    .then(function (response) {
      $scope.tongSoDonThangNay = response.data;
    });

  $scope.tongSoDonNamNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-nam-nay", config)
    .then(function (response) {
      $scope.tongSoDonNamNay = response.data;
    });

  $scope.soDonHuyHnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-huy-hom-nay", config)
    .then(function (response) {
      $scope.soDonHuyHnay = response.data;
    });

  $scope.soDonHuyTuanNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-huy-tuan-nay", config)
    .then(function (response) {
      $scope.soDonHuyTuanNay = response.data;
    });

  $scope.soDonHuyThangNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-huy-thang-nay", config)
    .then(function (response) {
      $scope.soDonHuyThangNay = response.data;
    });

  $scope.soDonHuyNamNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-huy-nam-nay", config)
    .then(function (response) {
      $scope.soDonHuyNamNay = response.data;
    });

  $scope.soSanPhamBanRaHomNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/sum-day-number-product", config)
    .then(function (response) {
      $scope.soSanPhamBanRaHomNay = response.data;
    });

  $scope.soSanPhamBanRaTuanNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/sum-week-number-product", config)
    .then(function (response) {
      $scope.soSanPhamBanRaTuanNay = response.data;
    });

  $scope.soSanPhamBanRaThangNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/sum-month-number-product", config)
    .then(function (response) {
      $scope.soSanPhamBanRaThangNay = response.data;
    });

  $scope.soSanPhamBanRaNamNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/sum-year-number-product", config)
    .then(function (response) {
      $scope.soSanPhamBanRaNamNay = response.data;
    });

  $scope.getListSanPhamBanChay = function () {
    $http
      .get("http://localhost:8080/api/thong-ke/san-pham-ban-chay", config)
      .then(function (response) {
        $scope.listSanPhamBanChay = response.data;
        $scope.listSanPhamBanChay.sort(function(a, b) {
          return b.soLuongDaBan - a.soLuongDaBan;
        });
        $scope.listSanPhamBanChay = $scope.listSanPhamBanChay.slice(0, 10);
      });
  };
  $scope.getListSanPhamBanChay();

  var currentDate = new Date();
  var firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Gán giá trị mặc định cho ngày bắt đầu và ngày kết thúc
  $scope.startDate = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth(),
    1
  );
  $scope.endDate = new Date(Date.parse(currentDate.toISOString().slice(0, 10)));

  var ctxBar = document.getElementById("myBarChart").getContext("2d");

  // Khởi tạo biểu đồ
  var ctxBar = document.getElementById("myBarChart").getContext("2d");
  var myBarChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: [], // Sẽ cập nhật labels sau
      datasets: [
        {
          label: "Doanh số",
          data: [], // Sẽ cập nhật data sau
          backgroundColor: "#36a2eb",
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  $scope.doanhThu = [];

  // Hàm xử lý dữ liệu và cập nhật biểu đồ cột
  function processDataAndDisplayChart(data) {
    var labels = [];
    var salesData = [];

    // Xử lý dữ liệu trả về từ API
    data.forEach(function (item) {
      labels.push(item.ngay); // Thêm ngày vào mảng labels
      salesData.push(item.doanhThu); // Thêm doanh số vào mảng salesData
    });

    // Cập nhật biểu đồ cột
    myBarChart.data.labels = labels;
    myBarChart.data.datasets[0].data = salesData;
    myBarChart.update();
  }

  function formatDateToYYYYMMDD(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    return year + "/" + month + "/" + day;
  }

  $scope.updateChart = function () {
    var startDate = new Date($scope.startDate);
    var endDate = new Date($scope.endDate);
    $http
      .get(
        "http://localhost:8080/api/thong-ke/doanhthu?ngayBd=" +
          formatDateToYYYYMMDD(startDate) +
          "&ngayKt=" +
          formatDateToYYYYMMDD(endDate),
        config
      )
      .then(function (response) {
        processDataAndDisplayChart(response.data);
      });
  };

  $scope.updateChart();
});
