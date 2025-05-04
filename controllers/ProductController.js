const productModel = require('../models/Product');
const categoryModel = require('../models/Category');
const commentModel = require('../models/Comment');
class ProductController {
	static index = async (req, res) => {
		try {
			let conds = {};
			let sorts = {};
			const page = Number(req.query.page ?? 1);
			const item_per_page = 10;


			const category_id = req.params.category_id;
			if(category_id){
				conds = {
					'category_id' : {
						'type': '=',
						'val': category_id, //3
					}
				}
				//SELECT * FROM view_product where category_id = 3
			}

			console.log(req.query);
			// ?price-range=200000-300000
			const priceRange = req.query['price-range'];
			if(priceRange){
				const temp = priceRange.split('-');
				const start = temp[0];
				const end = temp[1];
				conds = {
					...conds,
					'sale_price' : {
						'type': 'BETWEEN',
						'val': `${start} and ${end}`
					}
				}

				if(end == 'greater'){
					conds = {
						...conds,
						'sale_price': {
							'type': '>',
							'val': start,
						}
					}
				}
			}
			
			// sort=price-desc
			const sort = req.query.sort;
			if(sort){
				const temp = sort.split('-');
				const dummyCol = temp[0]; //price
				const order = temp[1]; //asc
				// bảng ánh xạ
				const map = {
					price: 'sale_price',
					alpha: 'name',
					created: 'created_date'
				}
				const colName = map[dummyCol];
				sorts = {
					// [biến] nghĩa là ép nó thay thế giá trị của biến thành tên thuộc tính
					[colName]: order.toUpperCase()
				}

			}

			const search =req.query.search ?? null;
			if(search){
				conds = {
					'name' : {
						'type': 'LIKE',
						'val': `'%${search}%'`, //kem
					}
				}
				//SELECT * FROM view_product where name = kem
			}


			let products = await productModel.getBy(conds, sorts, page, item_per_page);
			const allProducts = await productModel.getBy(conds, sorts);

			// Lấy danh mục sản phẩm
			const categories = await categoryModel.all();

			const totalPage = Math.ceil(allProducts.length/ item_per_page);

			// console.log(req.session.message_success);
			res.render('product/index', {	
				products: products,
				categories: categories,
				category_id: category_id,
				priceRange: priceRange,
				sort: sort,
				totalPage: totalPage,
				page: page,
				search: search
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	static detail = async (req, res) => {
		try {

			const slug = req.params.slug;
			console.log(slug);

			const temp = slug.split('-');
			const id = temp[temp.length - 1];

			const product = await productModel.find(id);
			const category_id = product.category_id;

			const priceRange = req.query['price-range'];
			// hình có liên quan
			const imageItems = await product.getImageItems();


			// lấy thương hiệu của sản phẩm
			const brand = await product.getBrand();

			// lấy comment của 1 sản phẩm
			const comments = await product.getComments();

			// lấy sản phẩm có liên quan (sản phẩm có cùng danh mục)
			const conds = {
				'category_id' : {
					'type': '=',
					'val': category_id, //3
				},
				// loại thằng đang có ở trên ra 
				'id' : {
					'type': '!=',
					'val': id, //3
				}
			}
			//SELECT * FROM view_product where category_id = 3
			const relatedProducts = await productModel.getBy(conds, []);
			console.log(relatedProducts);
			// Lấy danh mục sản phẩm
			const categories = await categoryModel.all();
			res.render('product/detail', {	
				product: product,
				category_id: category_id,
				categories: categories,
				priceRange: priceRange,
				imageItems: imageItems,
				brand: brand,
				comments: comments,
				relatedProducts: relatedProducts
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

	static comments = async (req, res) => {
		try {
			
			// 2 Bước:
			// B1: lưu comment
			const data = {
				product_id: req.body.product_id,
				email: req.body.email,
				fullname: req.body.fullname,
				description: req.body.description,
				star: req.body.rating,
				created_date: req.app.locals.helpers.getCurrentDateTime(),
			};
			await commentModel.save(data);
			// B2: Đổ danh sách comment ngược lại view
			const product = await productModel.find(req.body.product_id)
			const comments = await product.getComments()
			res.render('product/comments', {	
				layout: false,
				comments: comments
			})
		} catch (error) {
			console.log(error);//cho dev xem
			// trạng thái 500 là lỗi internal server
			res.status(500).send(error.message); //cho người dùng xem
		}
	}

}
// export để bên ngoài gọi dùng, nếu không export thì bên ngoài không gọi để xài được
module.exports = ProductController;