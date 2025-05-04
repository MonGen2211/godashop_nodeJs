const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');
const ProductController = require('../controllers/ProductController');
const PolicyController = require('../controllers/PolicyController');
const ContactController = require('../controllers/ContactController');
const AuthController = require('../controllers/AuthController');
const CustomerController = require('../controllers/CustomerController');
const CartController = require('../controllers/CartController');
const AddressController = require('../controllers/AddressController');
const PaymentController = require('../controllers/PaymentController');

router.get('/', HomeController.index);

// Hiển thị trang danh sách sản phẩm
router.get('/san-pham.html' , ProductController.index);

// Hiển thị sản phẩm theo danh mục
// nào thay đổi thì dùng slug
// /danh-muc/sua-rua-mat/c5.html
// lấy slug và category_id thông qua req.params ở controller
router.get('/danh-muc/:slug/c:category_id.html' , ProductController.index);

// Hiển thị chi tiết sản phẩm
// /san-pham/sua-rua-mat-cerave-sach-sau-cho-da-thuong-den-da-dau-473ml-102959.html
router.get('/san-pham/:slug.html' , ProductController.detail);


// Trang policy
router.get('/chinh-sach-doi-tra.html' , PolicyController.return);
router.get('/chinh-sach-thanh-toan.html' , PolicyController.payment);
router.get('/chinh-sach-giao-hang.html' , PolicyController.delivery);

// Trang contact
router.get('/lien-he.html' , ContactController.form);

// gửi email
router.post('/contact/sendEmail' , ContactController.sendEmail);

// lưu comment
router.post('/comments' , ProductController.comments);

// login
router.post('/login' , AuthController.login);

// logout
router.get('/logout' , AuthController.logout);

// /thong-tin-tai-khoan.html
router.get('/thong-tin-tai-khoan.html' , CustomerController.show);

// /dia-chi-giao-hang-mac-dinh.html
router.get('/dia-chi-giao-hang-mac-dinh.html' , CustomerController.shippingDefault	);


// /don-hang-cua-toi.html
router.get('/don-hang-cua-toi.html' , CustomerController.orders);

// /chi-tiet-don-hang.html
router.get('/chi-tiet-don-hang.html' , CustomerController.orderDetail);

// /thong-tin-tai-khoan.html cập nhật thông tin tài khoản
router.post('/customer/updateInfo' , CustomerController.updateInfo);

// /chi-tiet-don-hang-4.html
router.get('/chi-tiet-don-hang-:order_id.html' , CustomerController.orderDetail);

// giỏ hàng
router.get('/cart/add' , CartController.add);

// xóa sản phẩm trong giỏ hàng
router.get('/cart/delete' , CartController.delete);


// cập nhập lại số lượng sản phẩm trong giỏ hàng
router.get('/cart/update' , CartController.update);

// đặt hàng
router.get('/dat-hang.html' , PaymentController.checkout);


// lấy quận
router.get('/address/districts' , AddressController.districts);

// đặt phường
router.get('/address/wards' , AddressController.wards);

// lấy giá shipping
router.get('/address/shippingfee' , AddressController.shippingFee);

// lấy giá shipping
router.post('/thanh-toan.html' , PaymentController.order);
module.exports = router;