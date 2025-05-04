
class AddressController {
    static districts = async (req, res) => {
        // trycatch
        const provinceModel = require('../models/Province');
        try {
            const province_id = req.query.province_id;
            const province = await provinceModel.find(province_id);
            const districts = await province.getDistricts();
            // send về trình duyệt dạng json
            const json_str = JSON.stringify(districts);
            res.end(json_str);

        } catch (error) {
            // 500 là lỗi internal server (lỗi xãy ra ở server)
            console.log(error);//dành cho dev xem
            res.status(500).send(error.message);//cho người dùng xem
        }

    }

    static shippingFee = async (req, res) => {
        // trycatch

        try {
            const transportModel = require('../models/Transport');
            const province_id = req.query.province_id;
            const transport = await transportModel.getByProvinceId(province_id);
            // cần chuyển số thành chuỗi trước khi gởi về
            res.end(transport.price.toString());

        } catch (error) {
            // 500 là lỗi internal server (lỗi xãy ra ở server)
            console.log(error);//dành cho dev xem
            res.status(500).send(error.message);//cho người dùng xem
        }

    }

    static wards = async (req, res) => {
        // trycatch
        const districtModel = require('../models/District');
        try {
            const district_id = req.query.district_id;
            const district = await districtModel.find(district_id);
            const wards = await district.getWards();
            // send về trình duyệt dạng json
            const json_str = JSON.stringify(wards);
            res.end(json_str);

        } catch (error) {
            // 500 là lỗi internal server (lỗi xãy ra ở server)
            console.log(error);//dành cho dev xem
            res.status(500).send(error.message);//cho người dùng xem
        }

    }
}

module.exports = AddressController;