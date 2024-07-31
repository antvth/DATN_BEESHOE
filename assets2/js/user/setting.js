clientApp.controller('informationController',
    function ($scope, $http, $window) {
        var today = new Date();
        $scope.avatar = "";
        $scope.customer = JSON.parse(localStorage.getItem("user"));

        // REGEX
        var phone_regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // choose gender
        $scope.selectGender = function (gender) {
            $scope.customer.gioiTinh = gender
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

        $scope.loadData = () => {
            $scope.customer = JSON.parse(localStorage.getItem("user"));
            if ($scope.customer.maPhuong !== null && $scope.customer.maXa !== null && $scope.customer.maTinh !== null) {
                $scope.getAllprovideByCode($scope.customer.maPhuong, $scope.customer.maXa, $scope.customer.maTinh)
            } else {
                $scope.getAllprovide()
            }
        }

        $scope.loadData()



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

            $scope.customer.maTinh = provinceid
            $scope.customer.tinh = selectedOption.textContent

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

            $scope.customer.maPhuong = districtid;
            $scope.customer.phuong = selectedOption.textContent

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

        $scope.selectWard = function () {
            const ward_selected = selectWardCodeCustomer.options[selectWardCodeCustomer.selectedIndex];
            const ward_attribute = ward_selected.getAttribute("WardCode");
            const code_ward = ward_attribute;

            $scope.customer.maXa = code_ward
            $scope.customer.xa = ward_selected.textContent

            console.log($scope.customer)
        }

        $scope.getAllDistrictByCode = function (ward_code, district_code, provinceCode) {

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
                    validateAddress()
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
                axios.post("http://localhost:8080/cloudinary/upload",
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                    .then((res) => {
                        $scope.avatar = res.data.secure_url;
                        console.log($scope.avatar)
                    }).catch((error) => console.error("Error:", error));
            }

            readURL(element)
        }

        $scope.updateCustomer = function () {
            $scope.customer.gioiTinh = Number($scope.customer.gioiTinh)


            if ($scope.customer.ten === ""
                || $scope.customer.email === ""
                || $scope.customer.soDienThoai === ""
                || $scope.customer.maTinh === ""
                || $scope.customer.maPhuong === ""
                || $scope.customer.maXa === ""
                || $scope.customer.diaChi === "") {
                toastr.error('Bạn phải nhập đầy các trường có trên form ')
                return;
            }

            if (!email_regex.test($scope.customer.email)) {
                toastr.error('Bạn phải nhập đúng định dạng email')
                return;
            }

            if (!phone_regex.test($scope.customer.soDienThoai)) {
                toastr.error('Bạn phải nhập đúng định dạng số điện thoại')
                return;
            }

            if ($scope.avatar != "") {
                $scope.customer.avatar = $scope.avatar
            }

            Swal.fire({
                title: "Xác nhận lưu thay đổi?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put("http://localhost:8080/customer/update", $scope.customer)
                        .then((res) => {
                            toastr.success("Thay đổi thành công")
                            localStorage.setItem("user", JSON.stringify(res.data))
                            setTimeout(() => {
                                $window.location.reload()
                                $window.location.href= "#!trang-chu"                         
                            },200)
                            $window.localtion.reload()
                        })
                        .catch((error) => console.error("Error:", error));

                }
            });

        }

    });