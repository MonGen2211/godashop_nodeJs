const productModel = require('../models/Product');
const categoryModel = require('../models/Category');

class ContactController {
	static form = async (req, res) => {
		try {
			
			res.render('contact/form', {
				
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	static sendEmail = async (req, res) => {
		try {
			// console.log(req.protocol, req.headers.host);
			const url = `${req.protocol}://${req.headers.host}`
			const to = process.env.SHOP_OWNER;
			const subject = `${process.env.APP_NAME} - Liên hệ`;

			const content = `
				Xin chào chủ cửa hàng, <br>
				Dưới đây là thông tin khách hàng liên heejL <br>
				Tên: ${req.body.fullname},<br>
				Email: ${req.body.email},<br>
				Số điện thoại: ${req.body.mobile},<br>
				Nội dung: ${req.body.content} <br>
				Được gửi từ trang web: ${url}
				
			` 
			req.app.locals.helpers.sendEmail(to, subject, content)

			res.end('Đã gửi email thành công :) !')
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}
}
// export để bên ngoài gọi dùng, nếu không export thì bên ngoài không gọi để xài được
module.exports = ContactController;