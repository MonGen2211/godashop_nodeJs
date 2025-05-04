const productModel = require('../models/Product');
const categoryModel = require('../models/Category');
class PolicyController {
	static return = async (req, res) => {
		try {
			
			res.render('policy/return', {
				
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	static payment = async (req, res) => {
		try {
			
			res.render('policy/payment', {
				
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	static delivery = async (req, res) => {
		try {
			
			res.render('policy/delivery', {
				
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

}
// export để bên ngoài gọi dùng, nếu không export thì bên ngoài không gọi để xài được
module.exports = PolicyController;