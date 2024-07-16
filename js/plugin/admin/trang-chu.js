var isHienThi = false;
var ctx = document.getElementById('myChart2').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'Earning',
            data: [12, 19, 3, 5, 2, 3, 11, 10, 9, 8, 2, 12],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(211, 46, 78, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(111, 22, 44, 1)',
                'rgba(11, 22, 255, 1)',
                'rgba(222, 162, 235, 1)',
                'rgba(211, 206, 86, 1)',
                'rgba(111, 192, 192, 1)',
                'rgba(211, 22, 255, 1)',
                'rgba(223, 111, 64, 1)'
            ],
        }]
    },
    options: {
        responsive: true
    }
});
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Đã hoàn thành', 'Đã hủy', 'Đang chờ xác nhận', 'Đã xác nhận'],
        datasets: [{
            label: 'Số %',
            data: [70, 5, 20, 5],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(211, 46, 78, 1)'
            ],
        }]
    },
    options: {
        responsive: true
    }
});
/*button*/
const button = document.querySelector(".button");
button.addEventListener("click", (e) => {
    e.preventDefault;
    button.classList.add("animate");
    setTimeout(() => {
        button.classList.remove("animate");
    }, 600);
});
function toggleSubMenu() {
    var subMenu = document.getElementById("subMenu");
    if (subMenu.style.display === "none") {
        subMenu.style.display = "block";
    } else {
        subMenu.style.display = "none";
    }
}
function toggleNoiDung() {
    var noiDung = document.getElementById("noiDung");
    isHienThi = !isHienThi;
    if (isHienThi) {
        noiDung.style.display = "block";
    } else {
        noiDung.style.display = "none";
    }
}
