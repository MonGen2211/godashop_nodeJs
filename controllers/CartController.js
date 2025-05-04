const Cart = require('../models/Cart');
class CartController {
    static add = async (req, res) => {
        // trycatch
        try {
            // Lấy cookie có tên là cart từ trình duyệt web gởi lên
            // Cookie được lưu ở trình duyệt web
            // req.cookies.cart là lấy giá trị của cookie cart từ trình duyệt web gởi lên
            const cart = new Cart(req.cookies.cart);
            const product_id = req.query.product_id;
            const qty = req.query.qty;
            await cart.addProduct(product_id, qty);
            const stringCart = cart.toString();//chuyển obj -> string
            // lưu giỏ hàng xuống lại cookie (ở trình duyệt web)
            res.cookie('cart', stringCart, {
                // thời gian sống của cookie, đơn vị mili giây 
                // Sống 1h thì ta có: 1 x 60 x 60 x 1000 = 3600000
                maxAge: 3600000,
                // Giá trị false thì cho phép truy cập cookie này ở trình duyệt web lẫn server, nếu true thì chỉ cho phép truy cập ở server
                httpOnly: false
            });
            // không gởi về dữ liệu, chỉ gởi về trình duyệt web cookie thôi.
            res.end();

        } catch (error) {
            // 500 là lỗi internal server (lỗi xãy ra ở server)
            console.log(error);//dành cho dev xem
            res.status(500).send(error.message);//cho người dùng xem
        }

    }


    static delete = (req, res) => {
        // trycatch
        try {
            // Lấy cookie có tên là cart từ trình duyệt web gởi lên
            // Cookie được lưu ở trình duyệt web
            // req.cookies.cart là lấy giá trị của cookie cart từ trình duyệt web gởi lên
            const cart = new Cart(req.cookies.cart);
            const product_id = req.query.product_id;
            cart.deleteProduct(product_id);
            const stringCart = cart.toString();//chuyển obj -> string
            // lưu giỏ hàng xuống lại cookie (ở trình duyệt web)
            res.cookie('cart', stringCart, {
                // thời gian sống của cookie, đơn vị mili giây 
                // Sống 1h thì ta có: 1 x 60 x 60 x 1000 = 3600000
                maxAge: 3600000,
                // Giá trị false thì cho phép truy cập cookie này ở trình duyệt web lẫn server, nếu true thì chỉ cho phép truy cập ở server
                httpOnly: false
            });
            // không gởi về dữ liệu, chỉ gởi về trình duyệt web cookie thôi.
            res.end();

        } catch (error) {
            // 500 là lỗi internal server (lỗi xãy ra ở server)
            console.log(error);//dành cho dev xem
            res.status(500).send(error.message);//cho người dùng xem
        }

    }

    static update = async (req, res) => {
        // trycatch
        try {
            // Lấy cookie có tên là cart từ trình duyệt web gởi lên
            // Cookie được lưu ở trình duyệt web
            // req.cookies.cart là lấy giá trị của cookie cart từ trình duyệt web gởi lên
            const cart = new Cart(req.cookies.cart);
            const product_id = req.query.product_id;
            const qty = req.query.qty;
            cart.deleteProduct(product_id);
            await cart.addProduct(product_id, qty);
            const stringCart = cart.toString();//chuyển obj -> string
            // lưu giỏ hàng xuống lại cookie (ở trình duyệt web)
            res.cookie('cart', stringCart, {
                // thời gian sống của cookie, đơn vị mili giây 
                // Sống 1h thì ta có: 1 x 60 x 60 x 1000 = 3600000
                maxAge: 3600000,
                // Giá trị false thì cho phép truy cập cookie này ở trình duyệt web lẫn server, nếu true thì chỉ cho phép truy cập ở server
                httpOnly: false
            });
            // không gởi về dữ liệu, chỉ gởi về trình duyệt web cookie thôi.
            res.end();

        } catch (error) {
            // 500 là lỗi internal server (lỗi xãy ra ở server)
            console.log(error);//dành cho dev xem
            res.status(500).send(error.message);//cho người dùng xem
        }

    }
}

module.exports = CartController;