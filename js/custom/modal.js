function increment() {
  var input = document.getElementById("quantityInput");
  input.value = parseInt(input.value) + 1;
}

function decrement() {
  var input = document.getElementById("quantityInput");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

function openCity(statusOrders) {
  var i;
  var x = document.getElementsByClassName("status");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(statusOrders).style.display = "block";
  const links = document.querySelectorAll(".navbar-nav .nav-link");

  // Thêm sự kiện click cho mỗi thẻ <a>
  links.forEach((link) => {
    link.addEventListener("click", function () {
      // Loại bỏ lớp active từ tất cả các thẻ <a>
      links.forEach((link) => link.parentElement.classList.remove("active"));

      // Thêm lớp active cho thẻ <a> được nhấp vào
      this.parentElement.classList.add("active");
    });
  });
}
