function toggleCheckbox() {
  var selectElement = document.getElementById("selectOption");
  var checkboxContainer = document.getElementById("checkboxContainer");
  var checkbox = document.getElementById("flexCheckDefault");

  if (selectElement.value === "%") {
    checkboxContainer.style.display = "block";
    checkbox.checked = true;
  } else {
    checkboxContainer.style.display = "none";
    checkbox.checked = false;
  }
}

var rdo = document.querySelectorAll('input[type="radio"][name="ok"]');
var rdoCt1 = document.getElementById("rdoCt1");
var rdoCt2 = document.getElementById("rdoCt2");

// Thêm sự kiện click cho mỗi radio button
rdo.forEach(function (rdos) {
  rdos.addEventListener("click", function () {
    if (rdos.checked) {
      // Kiểm tra radio button nào được chọn và hiển thị/div ẩn điều kiện tương ứng
      if (rdos.id === "rdo1") {
        rdoCt1.style.display = "block";
        rdoCt2.style.display = "none";
      } else {
        rdoCt1.style.display = "none";
        rdoCt2.style.display = "block";
      }
    }
  });
});

var radioButtons = document.querySelectorAll(
  'input[type="radio"][name="flexRadioDefault"]'
);
var inputContainer1 = document.getElementById("inputContainer1");
var inputContainer2 = document.getElementById("inputContainer2");

// Thêm sự kiện click cho mỗi radio button
radioButtons.forEach(function (radioButton) {
  radioButton.addEventListener("click", function () {
    if (radioButton.checked) {
      // Kiểm tra radio button nào được chọn và hiển thị/div ẩn điều kiện tương ứng
      if (radioButton.id === "flexRadioDefault1") {
        inputContainer1.style.display = "block";
        inputContainer2.style.display = "none";
      } else {
        inputContainer1.style.display = "none";
        inputContainer2.style.display = "block";
      }
    }
  });
});
function toggleSubMenu() {
  var subMenu = document.getElementById("subMenu");
  if (subMenu.style.display === "none") {
    subMenu.style.display = "block";
  } else {
    subMenu.style.display = "none";
  }
}

function toggleCard() {
  var selectElement = document.getElementById("selectOption");
  var checkboxContainer = document.getElementById("checkboxContainer");
  var checkbox = document.getElementById("flexCheckDefault");

  if (selectElement.value === "%") {
    checkboxContainer.style.display = "block";
    checkbox.checked = true;
  } else {
    checkboxContainer.style.display = "none";
    checkbox.checked = false;
  }
}

function showContent() {
  var select = document.querySelector('.custom-select');
  var selectedValue = select.value;

  // Ẩn tất cả các div chứa nội dung
  var contentDivs = document.querySelectorAll('div[id$="Content"]');
  contentDivs.forEach(function(div) {
      div.style.display = 'none';
  });

  // Hiển thị div tương ứng với tùy chọn được chọn
  var selectedDiv = document.getElementById(selectedValue + 'Content');
  if (selectedDiv) {
      selectedDiv.style.display = 'block';
  }
}

