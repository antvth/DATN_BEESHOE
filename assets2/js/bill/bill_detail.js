clientApp.controller('billDetailController',
    function ($scope, $http, $routeParams) {

        var id = $routeParams.id
        var today = new Date();
        var file = "";

        // customer
        $scope.customer = JSON.parse(localStorage.getItem("customer"));

        // bill
        $scope.bill = {}
        $scope.oldBill = {}
        $scope.billDetails = []
        $scope.history = []
        $scope.listProducts = []

        // panigation
        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.totalItems = 0;

        // history
        $scope.billState1 = {}
        $scope.billState2 = {}
        $scope.billState3 = {}
        $scope.billState4 = {}
        $scope.billState6 = {}

        // note
        $scope.noteState1 = ""
        $scope.noteState2 = ""
        $scope.noteState3 = ""
        $scope.noteState4 = ""
        $scope.noteState5 = ""
        $scope.noteState7 = ""

        // product refund
        $scope.billDetailRefund = {}
        $scope.quantityRefund = 0;

        // payment
        $scope.paymentMethods = []
        $scope.moneyChange = 0;
        $scope.paymentMethod = 0;
        $scope.moneyPayment = "";

        // REGEX
        var phone_regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // choose gender
        $scope.selectGender = function (gender) {
            $scope.customer.gioiTinh = gender
        }

        $scope.loadBill = () => {
            $http.get('http://localhost:8080/bill/get-bill/' + id).then(
                function (res) {
                    $scope.bill = res.data;
                }, function (error) {
                    console.log('Không tìm thấy hóa đơn này.Vui lòng nhập lại id!')
                }
            )

            $http.get('http://localhost:8080/bill/get-bill/' + id).then(
                function (res) {
                    $scope.oldBill = res.data;
                }, function (error) {
                    console.log('Không tìm thấy hóa đơn này.Vui lòng nhập lại id!')
                }
            )

            $http.get('http://localhost:8080/bill-detail/get-by-bill?id=' + id + "&page=" + 0 + "&size=" + 100).then(
                function (response) {
                    $scope.billDetails = response.data
                    $scope.totalItemBillDetails = response.data.totalElements
                    $scope.bill.tongTien = 0
                    for (var i = 0; i < $scope.billDetails.content.length; i++) {
                        if ($scope.billDetails.content[i].donGiaSauKhiGiam == null) {
                            $scope.bill.tongTien += Number($scope.billDetails.content[i].donGia) * Number($scope.billDetails.content[i].soLuong)
                        } else {
                            $scope.bill.tongTien += Number($scope.billDetails.content[i].donGiaSauKhiGiam) * Number($scope.billDetails.content[i].soLuong)
                        }
                    }
                    $scope.bill.tongTienSauGiam = Number($scope.bill.tongTien)

                    if ($scope.bill.idVoucher != null) {
                        $scope.bill.tongTienSauGiam = (100 - $scope.bill.soPhanTramKhuyenMai) * $scope.bill.tongTien / 100
                    }

                    $scope.bill.tongTienSauGiam += Number($scope.bill.phiVanChuyen == null || $scope.bill.phiVanChuyen == "" ? 0 : $scope.bill.phiVanChuyen)
                }
            ).catch(function (error) {
                console.log(error)
            })

            $http.get("http://localhost:8080/history/get-all-by-id/" + id).then(function (response) {
                $scope.history = response.data
                console.log($scope.history)
                for (var i = 0; i < $scope.history.length; i++) {
                    if ($scope.history[i].trangThai == 1) {
                        $scope.billState1 = $scope.history[i]
                    } else if ($scope.history[i].trangThai == 2) {
                        $scope.billState2 = $scope.history[i]
                    } else if ($scope.history[i].trangThai == 3) {
                        $scope.billState3 = $scope.history[i]
                    } else if ($scope.history[i].trangThai == 4) {
                        $scope.billState4 = $scope.history[i]
                    } else if ($scope.history[i].trangThai == 6) {
                        $scope.billState6 = $scope.history[i]
                    }
                }
                console.log($scope.history)
            })
                .catch(function (error) {
                    console.log(error)
                })

            $http.get('http://localhost:8080/payment-method/get-all/' + id).then(function (response) {
                console.log(response.data)
                $scope.paymentMethods = response.data
                $scope.moneyChange = 0;

                // total money change
                response.data.forEach((x) => {
                    $scope.moneyChange += Number(x.soTienThanhToan)
                })

            }).catch(function (error) {
                console.log(error)
            })
        }

        $scope.getAllImagesByIDProductDetail = function (id, text) {
            var textFist = `
        <div id="carousel-${id}" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            
        `
            var textCenter = ''
            var textLast = `
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${id}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${id}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
            </button>
        </div>
        `
            var html = document.getElementById("image-" + id)
            if (text !== undefined) {
                var html = document.getElementById("image-" + text + "-" + id)
            }

            axios.get('http://localhost:8080/image/get-all/' + id).then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (i == 0) {
                        textCenter += `
                        <div class="carousel-item active">
                            <img src="${response.data[i].duongDan}" class="d-block w-100" alt="...">
                        </div>`
                    } else {
                        textCenter += `
                        <div class="carousel-item">
                            <img src="${response.data[i].duongDan}" class="d-block w-100" alt="...">
                        </div>`
                    }

                }

                html.innerHTML = textFist + textCenter + textLast

            }).catch(function (error) {
                console.log(error)
            })
        }

        $scope.loadBill()

        $scope.updateVoucher = function () {

            if ($scope.voucher.ten === "" ||
                $scope.voucher.giaTriToiDa === '' ||
                $scope.voucher.giaTriToiThieu === '' ||
                $scope.voucher.phanTramGiam === '' ||
                $scope.voucher.soLanDung === '' ||
                $scope.voucher.ngayBatDau === '' ||
                $scope.voucher.ngayKetThuc === ''
            ) {
                toastr.error('Bạn phải nhập đủ các trường có trên form')
                return;
            }

            if (isNaN($scope.voucher.giaTriToiDa)) {
                toastr.error('Giá trị tối đa phải là số')
                return;
            }

            if (isNaN($scope.voucher.giaTriToiThieu)) {
                toastr.error('Giá trị đơn tối thiểu phải là số')
                return;
            }

            if (isNaN($scope.voucher.phanTramGiam)) {
                toastr.error('Giá trị phần trên phải là số')
                return;
            }

            if (isNaN($scope.voucher.soLanDung)) {
                toastr.error('Số lần phải là số')
            }

            if ($scope.voucher.giaTriToiDa < 0) {
                toastr.error('Giá trị tối đa phải là số duơng')
                return;
            }

            if ($scope.voucher.giaTriToiThieu < 0) {
                toastr.error('Giá trị đơn tối thiểu phải là số duơng')
                return;
            }

            if ($scope.voucher.phanTramGiam < 0) {
                toastr.error('Giá trị phần trăm phải là số duơng')
                return;
            }

            if ($scope.voucher.phanTramGiam >= 100) {
                toastr.error('Giá trị phần trăm phải nhỏ hơn 100%')
                return;
            }

            if ($scope.voucher.soLanDung < 0) {
                toastr.error('Số lượng phải là số duơng')
                return;
            }

            if ($scope.voucher.ngayBatDau > $scope.voucher.ngayKetThuc) {
                toastr.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc')
                return;
            }

            if ($scope.voucher.ngayBatDau < today) {
                toastr.error('Ngày bắt đầu phải lớn hơn ngày hôm nay')
                return;
            }

            axios.put('http://localhost:8080/voucher/edit-voucher', $scope.voucher).then(
                (response) => {
                    toastr.success('Bạn đã thay đổi voucher thành công')
                    setTimeout(() => {
                        location.href = "/html/router.html#!/phieu-giam-gia"
                    }, 400)
                }
            ).catch((error) => {
                console.log(error)
                toastr.error('Đã có lỗi xảy ra.Vui lòng liên hệ quản trị viên')
            });

        }

        // FAST DELIVERY
        const token = "2b4b5f3e-ac78-11ee-a6e6-e60958111f48";
        const serviceID = 53320;
        const shopDistrictId = 1482;
        const shopWardCode = 11007;

        const selectCityCustomer = document.querySelector("#city");
        const selectDistrict = document.querySelector("#district");
        const selectWardCodeCustomer = document.querySelector("#ward");

        $scope.getAllprovide = function () {
            // const thisOrder = document.getElementById(`hoaDon${orderId}`);
            fetch(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    const defaultOption = document.createElement("option");
                    defaultOption.value = -1; // Set the value as needed
                    defaultOption.textContent = "--Chọn Tỉnh/Thành phố--"; // Set the text content
                    // Set the 'disabled' and 'selected' attributes to make it the default option
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    selectCityCustomer.appendChild(defaultOption);
                    const options = data.data;
                    for (let i = 0; i < options.length; i++) {
                        const option = document.createElement("option");
                        // option.value = options[i].ProvinceID; // Set the value of the option (you can change this to any value you want)
                        option.text = options[i].ProvinceName; // Set the text of the option
                        option.setAttribute("providecode", options[i].ProvinceID);
                        selectCityCustomer.appendChild(option); // Add the option to the select element
                    }
                })
                .catch((error) => console.error("Error:", error));
        }

        $scope.getAllDistrict = function () {
            const selectedOption = selectCityCustomer.options[selectCityCustomer.selectedIndex];
            const customAttribute = selectedOption.getAttribute("providecode");
            const provinceid = customAttribute;
            const selectDistrict = document.querySelector(` #district`);

            // remove child districts
            var old_options = selectDistrict.querySelectorAll("option");
            for (var i = 1; i < old_options.length; i++) {
                selectDistrict.removeChild(old_options[i]);
            }

            // remove child wards
            var old_options = selectWardCodeCustomer.querySelectorAll("option");
            for (var i = 1; i < old_options.length; i++) {
                selectWardCodeCustomer.removeChild(old_options[i]);
            }

            $scope.oldBill.maTinh = provinceid
            $scope.oldBill.tinh = selectedOption.textContent

            axios
                .get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                    params: {
                        province_id: provinceid,
                    },
                    headers: {
                        Accept: "application/json",
                        token: token,
                    },

                })
                .then((res) => {
                    const options = res.data.data;

                    for (let i = 0; i < options.length; i++) {
                        const option = document.createElement("option");
                        option.value = options[i].DistrictID; // Set the value of the option (you can change this to any value you want)
                        option.text = options[i].DistrictName; // Set the text of the option
                        option.setAttribute("districtcode", options[i].DistrictID);
                        selectDistrict.appendChild(option); // Add the option to the select element
                    }
                })
                .catch((error) => console.error("Error:", error));
        }

        $scope.getFullWardCode = function () {
            const selectedOption = selectDistrict.options[selectDistrict.selectedIndex];
            const customAttribute = selectedOption.getAttribute("districtcode");
            const districtid = customAttribute;

            // remove child
            var old_options = selectWardCodeCustomer.querySelectorAll("option");
            for (var i = 1; i < old_options.length; i++) {
                selectWardCodeCustomer.removeChild(old_options[i]);
            }

            $scope.oldBill.maPhuong = districtid;
            $scope.oldBill.phuong = selectedOption.textContent

            axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
                headers: {
                    Accept: "application/json",
                    token: token,
                },
                params: {
                    district_id: districtid,
                }
            })
                .then((res) => {
                    //remove all child
                    const options = res.data.data;
                    for (let i = 0; i < options.length; i++) {
                        const option = document.createElement("option");
                        option.value = options[i].WardCode; // Set the value of the option (you can change this to any value you want)
                        option.text = options[i].WardName; // Set the text of the option
                        option.setAttribute("WardCode", options[i].WardCode);
                        selectWardCodeCustomer.appendChild(option); // Add the option to the select element
                    }
                })
                .catch((error) => console.error("Error:", error));
        }

        // GET FEE SHIPPING
        $scope.getFeeShipping = () => {
            const district_selected = selectDistrict.options[selectDistrict.selectedIndex];
            const district_attribute = district_selected.getAttribute("districtcode");
            const id_district = district_attribute;

            const ward_selected = selectWardCodeCustomer.options[selectWardCodeCustomer.selectedIndex];
            const ward_attribute = ward_selected.getAttribute("WardCode");
            const code_ward = ward_attribute;

            $scope.oldBill.maXa = code_ward
            $scope.oldBill.xa = ward_selected.textContent

            axios.get(
                "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                {
                    params: {
                        from_district_id: shopDistrictId,
                        from_ward_code: shopWardCode,
                        service_id: serviceID,
                        to_district_id: id_district,
                        to_ward_code: code_ward,
                        weight: 240,
                    },
                    headers: {
                        token: token,
                        Accept: "application/json",
                    },
                }
            )
                .then((res) => {
                    $scope.oldBill.tongTienSauGiam = $scope.bill.tongTien + res.data.data.total
                    $scope.oldBill.phiVanChuyen = res.data.data.total
                    $scope.changePaymentMethod($scope.bill.phuongThucThanhToan);
                })
                .catch((error) => console.error("Error:", error));
        }

        $scope.getAllprovideByCode = function (district_code, ward_code, province_code) {

            // const thisOrder = document.getElementById(`hoaDon${orderId}`);
            fetch(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    const defaultOption = document.createElement("option");
                    defaultOption.value = -1; // Set the value as needed
                    defaultOption.textContent = "Chọn Tỉnh"; // Set the text content
                    // Set the 'disabled' and 'selected' attributes to make it the default option
                    defaultOption.disabled = true;
                    selectCityCustomer.appendChild(defaultOption);
                    const options = data.data;
                    for (let i = 0; i < options.length; i++) {
                        const option = document.createElement("option");
                        // option.value = options[i].ProvinceID; // Set the value of the option (you can change this to any value you want)
                        option.text = options[i].ProvinceName; // Set the text of the option
                        option.setAttribute("providecode", options[i].ProvinceID);
                        if (province_code === String(options[i].ProvinceID)) {
                            option.selected = true;
                        }
                        selectCityCustomer.appendChild(option); // Add the option to the select element
                    }
                    $scope.getAllDistrictByCode(ward_code, district_code, province_code)
                })
                .catch((error) => console.error("Error:", error));
        }

        $scope.getAllDistrictByCode = function (ward_code, district_code, provinceCode) {

            console.log(ward_code, district_code, provinceCode)
            axios
                .get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                    params: {
                        province_id: provinceCode,
                    },
                    headers: {
                        Accept: "application/json",
                        token: token,
                    },

                })
                .then((res) => {
                    const options = res.data.data;
                    console.log(options)

                    for (let i = 0; i < options.length; i++) {
                        const option = document.createElement("option");
                        option.value = options[i].DistrictID; // Set the value of the option (you can change this to any value you want)
                        option.text = options[i].DistrictName; // Set the text of the option
                        option.setAttribute("districtcode", options[i].DistrictID);
                        if (district_code === String(options[i].DistrictID)) {
                            option.selected = true;
                        }
                        selectDistrict.appendChild(option); // Add the option to the select element
                    }
                    $scope.getFullWardCodeByCode(ward_code, district_code)
                })
                .catch((error) => console.error("Error:", error));
        }

        $scope.getFullWardCodeByCode = function (ward_code, district_code) {

            axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
                headers: {
                    Accept: "application/json",
                    token: token,
                },
                params: {
                    district_id: district_code,
                }
            })
                .then((res) => {
                    //remove all child
                    const options = res.data.data;
                    for (let i = 0; i < options.length; i++) {
                        const option = document.createElement("option");
                        option.value = options[i].WardCode; // Set the value of the option (you can change this to any value you want)
                        option.text = options[i].WardName; // Set the text of the option
                        option.setAttribute("WardCode", options[i].WardCode);
                        if (ward_code === String(options[i].WardCode)) {
                            option.selected = true;
                        }
                        selectWardCodeCustomer.appendChild(option); // Add the option to the select element
                    }
                })
                .catch((error) => console.error("Error:", error));
        }

        var readURL = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('.profile_pic').attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

        $scope.changeImage = function (element) {

            if (element.files && element.files[0]) {
                const formData = new FormData();
                formData.append('file', element.files[0]);
                file = formData
            }

            readURL(element)
            var icon = document.getElementsByClassName('icon-upload-button')[0]
            icon.classList.add('icon-upload-button-close')
        }

        $scope.formatToVND = function (amount) {
            const formatter = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0, // Set to 0 to display whole numbers
            });
            return formatter.format(amount);
        }

        $scope.print = () => {
            var e = document.getElementById("invoice")
            console.log(e)
            w = window.open();
            w.document.write(e.innerHTML);
            w.print();
            w.close();
        }

        $scope.confirmBill = () => {
            if ($scope.bill === null) {
                toastr.error('Đã có lỗi xảy ra vui lòng kiểm tra lại')
            } else {
                var brandUpdateModal = document.querySelector("#confirmModal")
                var modal = bootstrap.Modal.getOrCreateInstance(brandUpdateModal)

                modal.hide()
                $scope.bill.trangThai = 2;
                $scope.updateStateOfBill($scope.bill.trangThai, $scope.noteState1)
                setTimeout(() => {
                    axios.post("http://localhost:8080/email/send-email", $scope.bill).then(function (response) {
                    }).catch(function (error) {
                    })
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã được xác nhận thành công`)
                    $scope.loadBill()
                }, 100)
            }

        }

        $scope.shippBill = function () {
            if ($scope.bill === null) {
                toastr.error('Đã có lỗi xảy ra vui lòng kiểm tra lại')
            } else {
                var brandUpdateModal = document.querySelector("#shipModal")
                var modal = bootstrap.Modal.getOrCreateInstance(brandUpdateModal)

                modal.hide()
                $scope.bill.trangThai = 3;
                $scope.updateStateOfBill($scope.bill.trangThai, $scope.noteState2)
                setTimeout(() => {
                    axios.post("http://localhost:8080/email/send-email", $scope.bill).then(function (response) {
                    }).catch(function (error) {
                    })
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã được giao cho bên vận chuyển.`)
                    $scope.loadBill()
                }, 100)
            }

        }

        $scope.successBill = function () {
            if ($scope.bill === null) {
                toastr.error('Đã có lỗi xảy ra vui lòng kiểm tra lại')
            } else {

                if ($scope.moneyChange < $scope.bill.tongTienSauGiam) {
                    toastr.error("Bạn phải xác nhận thanh toán trước khi hoàn thành đơn hàng.")
                    return;
                }

                var brandUpdateModal = document.querySelector("#successModal")
                var modal = bootstrap.Modal.getOrCreateInstance(brandUpdateModal)

                modal.hide()
                $scope.bill.trangThai = 4;
                $scope.updateStateOfBill($scope.bill.trangThai, $scope.noteState3)
                setTimeout(() => {
                    axios.post("http://localhost:8080/email/send-email", $scope.bill).then(function (response) {
                    }).catch(function (error) {
                    })
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã giao hàng thành công`)
                    $scope.loadBill()
                }, 100)
            }
        }

        $scope.updateStateOfBill = (trangThai, ghiChu) => {
            axios.put('http://localhost:8080/bill/update-bill', $scope.bill).then(function (response) {
                axios.post('http://localhost:8080/history/add', {
                    'trangThai': trangThai,
                    'ghiChu': ghiChu,
                    'hoaDon': response.data
                }).then(function (response) {

                }).catch(function (error) {
                    console.log(error);
                })

            })
                .catch(function (response) {
                    $scope.loadBill()
                    console.log(response.data)
                })
        }

        $scope.editCustomer = () => {
            $scope.loadBill()
            setTimeout(() => {
                $scope.getAllprovideByCode($scope.oldBill.maPhuong, $scope.oldBill.maXa, $scope.oldBill.maTinh)
                selectCityCustomer = document.getElementById("city");
                selectDistrict = document.getElementById("district");
                selectWardCodeCustomer = document.getElementById("ward");
            })

        }

        $scope.updateCustomer = function () {
          

            if ($scope.oldBill.tenNguoiNhan === ""
                || $scope.oldBill.sdtNguoiNhan === ""
                || $scope.oldBill.email === ""
                || $scope.oldBill.maTinh === ""
                || $scope.oldBill.maPhuong === ""
                || $scope.oldBill.maXa === ""
                || $scope.oldBill.diaChi === "") {
                toastr.error('Bạn phải nhập đầy các trường có trên form ')
                return;
            }

            if (!email_regex.test($scope.oldBill.email)) {
                toastr.error('Bạn phải nhập đúng định dạng email')
                return;
            }

            if (!phone_regex.test($scope.oldBill.sdtNguoiNhan)) {
                toastr.error('Bạn phải nhập đúng định dạng số điện thoại')
                $scope.bill = $scope.oldBill
                return;
            }

            $('#closeModalCustomer').click()
            $scope.getFeeShipping()

        }

        $scope.minusQuantity = function (billDetail) {

            if ($scope.moneyChange >= $scope.bill.tongTienSauGiam) {
                toastr.error("Bạn không thể giảm số lượng khi tổng giá trị đơn hàng nhỏ hơn hoặc bằng số tiền thanh toán .")
                return;
            }

            var quantityHtml = document.getElementById("bill-detail-quantity-" + billDetail.id)
            var quantityBillDetail = Number(quantityHtml.value) - 1
            if (quantityBillDetail == 0) {
                if ($scope.billDetails.content.length == 1) {
                    var brandUpdateModal = document.querySelector("#cancelModal")
                    var modal = bootstrap.Modal.getOrCreateInstance(brandUpdateModal)
                    modal.show()
                } else {
                    $scope.removeBillDetailByBillAndProductDetail(billDetail.id)
                }
            } else {
                quantityHtml.value = Number(quantityHtml.value) - 1
                $scope.addProductToBillApi(billDetail.idSanPhamChiTiet, $scope.bill, quantityHtml.value)
            }

        }

        $scope.plusQuantity = function (billDetail) {
            var quantityHtml = document.getElementById("bill-detail-quantity-" + billDetail.id)
            if(quantityHtml.value == 3){
                toastr.error("Bạn chỉ được thêm tối đa 3 sản phẩm trong một đơn hàng.")
                return;
            }
            quantityHtml.value = Number(quantityHtml.value) + 1
            $scope.addProductToBillApi(billDetail.idSanPhamChiTiet, $scope.bill, quantityHtml.value)
        }

        $scope.removeBillDetailByBillAndProductDetail = function (billDetailId) {
            console.log(`remove bill`)
            axios.delete('http://localhost:8080/bill-detail/remove-by-id/' + billDetailId).then(function (response) {
                setTimeout(() => {
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã thay đổi sản phẩm thành công`)
                }, 100);
            }).catch(function (response) {
                $scope.loadBill()
            })
        }

        $scope.loadBillDetail = () => {
            setTimeout(() => {
                axios.put('http://localhost:8080/bill/update-bill', $scope.bill).then(function (response) {
                }).catch(function (response) {
                })
            }, 200)
        }

        $scope.addProductToBillApi = function (productDetail, bill, quantity) {

            $http.post('http://localhost:8080/bill-detail/add-product-to-bill', {
                'hoaDon': bill,
                'sanPhamChiTiet': productDetail,
                'soLuong': quantity
            }).then(function (response) {
                // check gia tri toi thieu voucher 
                if ($scope.bill.idVoucher !== null) {
                    if (quantity * productDetail.donGia < $scope.bill.idVoucher.giaTriToiThieu) {
                        $scope.removeVoucher();
                    }
                }

                setTimeout(() => {
                    $scope.loadBill()
                }, 100)

                $scope.loadBillDetail()

            }).catch(function (error) {
                console.log(error);
                toastr.error(error);
            })

        }

        $scope.removeVoucher = function () {
            axios.put('http://localhost:8080/bill/add-voucher-to-bill', {
                'voucher': null,
                'hoaDon': $scope.bill
            }).then(function (response) {
                toastr.success("Xóa voucher thành công.");
            }).catch(function (response) {
                console.log(response.data)
            })
        }

        $scope.loadProductList = function () {
            $http.get('http://localhost:8080/product-detail/get-all?page=' + ($scope.currentPage - 1) + '&size=' + $scope.itemsPerPage,)
                .then(function (response) {
                    $scope.listProducts = response.data
                    $scope.totalItems = response.data.totalElements
                }).catch(function (error) {
                    console.log(error)
                });
        }

        $scope.pageChanged = function () {
            $http.get('http://localhost:8080/product-detail/get-all?page=' + ($scope.currentPage - 1) + '&size=' + $scope.itemsPerPage,)
                .then(function (response) {
                    $scope.productDetails = response.data
                });
        };

        $scope.addProductToBill = function (productDetail) {
          
            $scope.addProductToBillApi(productDetail, $scope.bill, -1)
            $scope.loadBillDetail()
            $('#closeModalProduct').click()
        }

        $scope.cancelBill = () => {

            $scope.bill.trangThai = 5
            axios.put('http://localhost:8080/bill/update-bill', $scope.bill).then(function (response) {

                axios.post('http://localhost:8080/history/add', {
                    'trangThai': 5,
                    'ghiChu': $scope.noteState5,
                    'hoaDon': response.data
                }).then(function (response) {
                    console.log(response.data)
                }).catch(function (error) {
                    console.log(error);
                })

                $scope.billDetails.content.forEach((x) => {
                    x.idSanPhamChiTiet.soLuongTon += x.soLuong
                    axios.put('http://localhost:8080/product-detail/update-product-detail', x.idSanPhamChiTiet)
                        .then((response) => {

                        }).catch((error) => {
                            console.log(error)
                        })
                })

                setTimeout(() => {
                    $('#closeCancelModal').click()
                    $scope.loadBill()
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã hủy thành công`)
                    // axios.post("http://localhost:8080/email/send-email", $scope.bill).then(function (response) {
                    // }).catch(function (error) {
                    // })
                }, 100)
            })
                .catch(function (response) {
                    $scope.loadBill()
                })
        }

        $scope.refundBill = () => {

            if ($scope.noteState4 == "") {
                toastr.error('Vui lòng nhập lý do')
                return;
            }

            if ($scope.bill === null) {
                toastr.error('Đã có lỗi xảy ra vui lòng kiểm tra lại')
            } else {
                var brandUpdateModal = document.querySelector("#refundModal")
                var modal = bootstrap.Modal.getOrCreateInstance(brandUpdateModal)

                modal.hide()
                $scope.bill.trangThai = 6;
                $scope.updateStateOfBill($scope.bill.trangThai, $scope.noteState4)
                toastr.success("Trả hàng thành công.")
                setTimeout(() => {
                    axios.post("http://localhost:8080/email/send-email", $scope.bill).then(function (response) {
                    }).catch(function (error) {
                    })
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã được hoàn lại hàng thành công`)
                    $scope.loadBill()
                }, 100)
            }
        }

        $scope.refundSingleBill = () => {
            if ($scope.noteState4 == "") {
                toastr.error('Vui lòng nhập lý do')
                return;
            }

            if (isNaN($scope.quantityRefund)) {
                toastr.error("Số lượng phải là số")
                return;
            }

            if (Number($scope.quantityRefund) < 0) {
                toastr.error("Số lượng phải lớn hơn 0")
                quantityHtml.value = 0;
                return;
            }

            if ($scope.bill === null) {
                toastr.error('Đã có lỗi xảy ra vui lòng kiểm tra lại')
            } else {
                var brandUpdateModal = document.querySelector("#billDetailSingleRefund")
                var modal = bootstrap.Modal.getOrCreateInstance(brandUpdateModal)

                modal.hide()
                $scope.bill.trangThai = 6;
                $scope.updateStateOfBill($scope.bill.trangThai, $scope.noteState4)
                toastr.success("Trả hàng thành công.")

                // $scope.addProductToBillApi($scope.billDetailRefund.idSanPhamChiTiet, $scope.bill, $scope.billDetailRefund.soLuong - $scope.quantityRefund)

                setTimeout(() => {
                    $scope.loadBill()
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã được hoàn lại thành công`)
                }, 100)
            }
        }

        // realtime
        var socket = new SockJS("http://localhost:8080/ws");
        var stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {

            stompClient.subscribe("/bill/bill-detail", function (message) {
                // toastr.success(message.body)
                $scope.loadBill()
                return;
            });
        });

        $scope.addBill = function (text) {
            toastr.success(text)
            var message = {
                name: text,
            };

            stompClient.send("/app/bill-detail", {}, JSON.stringify(message));
        };

        $scope.changePaymentMethod = (status) => {
            // change payment method whent money change 

            axios.put('http://localhost:8080/bill/update-bill', $scope.oldBill).then(function (response) {
                setTimeout(() => {
                    $scope.loadBill()
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã được thay đổi thông tin khách hàng thành công.`)
                }, 100);
            })
                .catch(function (response) {
                    $scope.loadBill()
                })

        }

        $scope.choosePaymentMethod = function (paymentMethod) {
            $scope.clearButtonPaymentMethod()

            var e = document.getElementById("payment-product-detail-" + paymentMethod);
            e.classList.remove("btn-outline-warning")
            e.classList.add("btn-warning")
            $scope.paymentMethod = paymentMethod
        }

        $scope.clearButtonPaymentMethod = function () {
            var html = document.getElementsByClassName("button-payment-method")

            for (var i = 0; i < html.length; i++) {
                html[i].classList.remove("btn-warning")
                html[i].classList.add("btn-outline-warning")
            }
        }

        $scope.confirmPayment = () => {
            // confirm payment
            var confirmPaymentModal = document.querySelector("#paymentModal")
            var modal = bootstrap.Modal.getOrCreateInstance(confirmPaymentModal)

            if ($scope.moneyPayment == "") {
                toastr.error("Vui lòng nhập số tiền.")
                return;
            }

            if (Number($scope.moneyPayment) < 1000) {
                toastr.error('Số tiền phải lớn hơn 1000')
                return;
            }

            axios.post('http://localhost:8080/history/add', {
                'trangThai': 7,
                'ghiChu': $scope.noteState7,
                'hoaDon': $scope.bill
            }).then(function (response) {
            }).catch(function (error) {
                console.log(error);
            })

            axios.post("http://localhost:8080/payment-method/add", {
                loaiThanhToan: $scope.paymentMethod,
                soTienThanhToan: Number($scope.moneyPayment),
                ghiChu: $scope.noteState7,
                idHoaDon: $scope.bill,
                deleted: true
            }).then(function (response) {
                modal.hide()

                setTimeout(() => {
                    $scope.addBill(`Hóa đơn ${$scope.bill.ma} đã thanh toán thành công.`)
                    $scope.loadBill()
                }, 100);
            }).catch(function (error) {
                console.log(error)
            })

        }

        $scope.loadMoneyPayment = () => {
            $scope.moneyPayment = $scope.bill.tongTienSauGiam - $scope.moneyChange
        }


    });