const customerModel = require('../models/Customer');
const orderModel = require('../models/Order');
const bcrypt = require('bcrypt');
const saltRounds = 10;
class CustomerController {
	static show = async (req, res) => {
		try {
			const email = req.session.email
			const customer = await customerModel.findEmail(email)

			res.render('customer/show', {
				customer: customer,
			});		
			
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	static updateInfo = async (req, res) => {
		try {
			const email = req.session.email;
			const customer = await customerModel.findEmail(email);
			customer.name = req.body.fullname;
			customer.mobile = req.body.mobile;
			// kiểm tra người dùng có đổi mật khẩu không?
			if(req.body.current_password && req.body.password){
				// kiểm tra mật khẩu hiện tại đúng ko
				if(!bcrypt.compareSync(req.body.current_password, customer.password)){
					req.session.message_success = `Lỗi: mật khẩu hiện tại không đúng`
					req.session.save(() => {
						res.redirect('/thong-tin-tai-khoan.html');
					})
					return;
				}
				// mật khẩu hiện tại đúng
				const saltRounds = 10;
				const salt = bcrypt.genSaltSync(saltRounds);
				// mật khẩu đã mã hóa rồi
				const new_password_enctypted = bcrypt.hashSync(req.body.password, salt);
				customer.password= new_password_enctypted;
			}

			await customer.update();
			req.session.message_success = `Đã cập nhật thông tin tài khoản thành công`
			// cập nhật session, tên người dùng
			req.session.name = customer.name;

			req.session.save(() => {
				res.redirect('/thong-tin-tai-khoan.html');
			})



		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	// địa chỉ giao hàng mặc định
	static shippingDefault = async (req, res) => {
		try {
			res.render('customer/shippingDefault', {

			})		} 
			catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	// danh sách đơn hàng
	static orders = async (req, res) => {
		try {
			const email = req.session.email;
			const customer = await customerModel.findEmail(email)
			const orders = await orderModel.getByCustomerId(customer.id);

			for(let i = 0; i <= orders.length - 1; i++){
				orders[i].orderItems = await orders[i].getOrderItems();
				for(let j = 0; j <= orders[i].orderItems.length - 1; j++){
					orders[i].orderItems[j].product = await orders[i].orderItems[j].getProduct();
				}
				orders[i].status = await orders[i].getStatus();

			}

			res.render('customer/orders', {
				orders: orders
			})		} 
			catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	// chi tiết đơn hàng
	static orderDetail = async (req, res) => {
			try {
				const order_id = req.params.order_id;
				const order = await orderModel.find(order_id);

				order.orderItems = await order.getOrderItems();
				for(let j = 0; j <= order.orderItems.length - 1; j++){
					order.orderItems[j].product = await order.orderItems[j].getProduct();
				}

				order.subTotalPrice = await order.getSubTotalPrice();

				// lấy phường quận thành phố từ ward_id
				const shippingWard = await order.getShippingWard();
				const shippingDistrict = await shippingWard.getDistrict();
				const shippingProvince = await shippingDistrict.getProvince();



				res.render('customer/orderDetail', {
					order: order,
					shippingWard: shippingWard.name,
					shippingDistrict: shippingDistrict.name,
					shippingProvince: shippingProvince.name,
				})		
			} 
				catch (error) {
				console.log(error);//cho dev xem
				// trạng thái 500 là lỗi internal server
				res.status(500).send(error.message); //cho người dùng xem
			}
	}

}
// export để bên ngoài gọi dùng, nếu không export thì bên ngoài không gọi để xài được
module.exports = CustomerController;