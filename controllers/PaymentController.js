const customerModel = require('../models/Customer');
const orderModel = require('../models/Order');
const Cart = require('../models/Cart');
const wardModel = require('../models/Ward');
const districtModel = require('../models/District');
const provinceModel = require('../models/Province');

class PaymentController {
	static checkout = async (req, res) => {
		const cart = new Cart(req.cookies.cart);
		const email = req.session.email || 'khacvanglai@gmail.com';
		const customer = await customerModel.findEmail(email);
		// show tất cả thành phố quận huyện
		const provinces = await provinceModel.all();
		// trường hợp chưa có province
		let selected_province_id = '';	
		let districts = '';
		let selected_district_id = '';

		let wards = '';
		let selected_ward_id = '';

		// trường hợp có ward.id
		let shipping_fee = 0;
		if(customer.ward_id){
			selected_ward_id = customer.ward_id;
			const selected_ward = await wardModel.find(selected_ward_id);

			selected_district_id = selected_ward.district_id;
			const selected_district = await districtModel.find(selected_district_id);

			selected_province_id = selected_district.province_id;	

			const transportModdel = require('../models/Transport')
			const transport = await transportModdel.getByProvinceId(selected_province_id);

			shipping_fee = transport.price;

			districts = await districtModel.getByProvinceId(selected_province_id);


			wards = await wardModel.getByDistrictId(selected_district_id);
		}



		try {

			res.render('payment/checkout', {
				cart: cart,
				customer: customer,
				shipping_fee: shipping_fee,
				provinces: provinces,
				selected_province_id: selected_province_id,
				districts: districts,
				selected_district_id: selected_district_id,
				wards: wards,
				selected_ward_id: selected_ward_id,
			});		
			
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	static order = async (req, res) => {

        // trycatch
        const cart = new Cart(req.cookies.cart);
        const email = req.session.email || 'khachvanglai@gmail.com';
        const customer = await customerModel.findEmail(email);
		
        const provinces = await provinceModel.all();
        let districts = [];
        let wards = [];
        let selected_ward_id = '';
        let selected_district_id = '';
        let selected_province_id = '';
        let shipping_fee = 0;
        if (customer.ward_id) {
            selected_ward_id = customer.ward_id;

            const selected_ward = await wardModel.find(selected_ward_id);
            const selected_district = await selected_ward.getDistrict();
            const selected_province = await selected_district.getProvince();

            // tìm danh sách wards và districts
            wards = await selected_district.getWards();
            districts = await selected_province.getDistricts();

            selected_district_id = selected_district.id;
            selected_province_id = selected_province.id;

            // phí giao hàng
            const transportModel = require('../models/Transport');
            const transport = await transportModel.getByProvinceId(selected_province_id);
            shipping_fee = transport.price;


        }

        try {
            //lưu xuống database
            const orderModel = require('../models/Order');
            const orderItemModel = require('../models/OrderItem');
            const data = {
                created_date: req.app.locals.helpers.getCurrentDateTime(),
                order_status_id: 1,
                staff_id: null,
                customer_id: customer.id,
                shipping_fullname: req.body.fullname,
                shipping_mobile: req.body.mobile,
                payment_method: req.body.payment_method,
                shipping_ward_id: req.body.ward,
                shipping_housenumber_street: req.body.address,
                shipping_fee: shipping_fee,
                delivered_date: req.app.locals.helpers.getThreeLaterDateTime()
            };
            const orderId = await orderModel.save(data);
            for (const product_id in cart.items) {
                const item = cart.items[product_id];
                const data = {
                    product_id: item.product_id,
                    order_id: orderId,
                    qty: item.qty,
                    unit_price: item.unit_price,
                    total_price: item.total_price,
                }
                await orderItemModel.save(data);
            }
            //xóa giỏ hàng ở cookie và session
            const cartEmpty = new Cart();
            const stringCart = cartEmpty.toString();//chuyển obj -> string
            // lưu giỏ hàng xuống lại cookie (ở trình duyệt web)
            res.cookie('cart', stringCart, {
                // thời gian sống của cookie, đơn vị mili giây 
                // Sống 1h thì ta có: 1 x 60 x 60 x 1000 = 3600000
                maxAge: 3600000,
                // Giá trị false thì cho phép truy cập cookie này ở trình duyệt web lẫn server, nếu true thì chỉ cho phép truy cập ở server
                httpOnly: false
            });

            // điều hướng về trang đơn hàng của tôi
            res.redirect('/don-hang-cua-toi.html');

        } catch (error) {
            // 500 là lỗi internal server (lỗi xãy ra ở server)
            console.log(error);//dành cho dev xem
            res.status(500).send(error.message);//cho người dùng xem
        }

    }


}
// export để bên ngoài gọi dùng, nếu không export thì bên ngoài không gọi để xài được
module.exports = PaymentController;