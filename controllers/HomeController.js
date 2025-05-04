const productModel = require('../models/Product');
const categoryModel = require('../models/Category');
class HomeController {
	static index = async (req, res) => {
		try {
			const conds = {};
			let sorts = { 'featured' : 'DESC' };
			const page = 1;
			const item_per_page = 4;
			const  featuredProducts = await productModel.getBy(conds, sorts, page, item_per_page);
			
			sorts = {'created_date' : 'DESC'};
			const  latestProducts = await productModel.getBy(conds, sorts, page, item_per_page);
			// Biến chứa danh sách tên danh mục và danh sách sản phẩm
			const categoryProducts = [];
			// lấy tất cả danh mục 
			const categories = await categoryModel.all();
			for (const category of categories) {

				const conds = {
					category_id : {
						type: '=',
						val: category.id,
					}	
				};
				const products = await productModel.getBy(conds, sorts, page, item_per_page);

				// Thêm vào biến chứa 
				categoryProducts.push(
					{
						categoryName: category.name,
						products: products
					}
				)
			}

			// console.log(req.session.message_success);
			res.render('home/index', {
				featuredProducts: featuredProducts,
				latestProducts: latestProducts,
				categoryProducts: categoryProducts,
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

}
// export để bên ngoài gọi dùng, nếu không export thì bên ngoài không gọi để xài được
module.exports = HomeController;