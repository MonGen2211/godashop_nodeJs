const customerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
class AuthController {
	static login = async (req, res) => {
		try {
			// 1. Kiểm tra email có tồn tại hay không
			const email = req.body.email;
			const customer = await customerModel.findEmail(email);
			if(!customer){
				// Lưu lỗi vào session và điều hướng về trang chủ 
				req.session.message_error = `Lỗi: không tồn tại email ${email} trong hệ thống`,
				res.redirect('/');
				return;
			}

			// 2. Mật khẩu sai
			const password = req.body.password;
			// const saltRounds = 10;
			// const salt = bcrypt.genSaltSync(saltRounds);
			// const hash = bcrypt.hashSync(password, salt);
			// res.end(hash);

			const match = bcrypt.compareSync(password, customer.password);
			if(!match){
				req.session.message_error = `Lỗi: Mật khẩu không đúng.Vui lòng nhập lại`,
				res.redirect('/');
				return;
			}


			// 3 Tài khoản chưa được kích hoạt
			if(!customer.is_active){
				req.session.message_error = `Lỗi: Tài khoản chưa được kích hoạt`,
				res.redirect('/');
				return;
			}

			// lưu tên và email vào session
			req.session.name = customer.name;
			req.session.email = customer.email;
			// tạm thời về trang chủ
			// tham số trong hàm save là 1 callback function
			// trong hàm save là 1 callback function
			req.session.save(() => {
				res.redirect('/thong-tin-tai-khoan.html');
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	static logout = async (req, res) => {
		try {
			req.session.destroy(() => {
				res.redirect('/')
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}
}
// export để bên ngoài gọi dùng, nếu không export thì bên ngoài không gọi để xài được
module.exports = AuthController;