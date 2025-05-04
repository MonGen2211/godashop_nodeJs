const numeral = require('numeral');
// chỉ định cho người dùng việt nam, để chuyển mặc định phân cách hàng nghìn từ dấy phẩy sang dấu chấm
require('numeral/locales/vi');
numeral.locale('vi');


const slugify = require('slugify')

exports.getCurrentRoute = (path) => {
	// trả về tên moduleName: student, subject, register
	// slice(1) là lấy từ vị trí 1 đến hết chuỗi
	console.log(path)
	// trang home
	path = path.startsWith('/') ? path.slice(1) : path
	if(path === ''){
		return 'home';
	}
	// trang product
	if(path.match(/^san-pham.html/)){
		return 'product';
	}

	// cách củ chuối
	// trang sản phẩm theo danh mục
	if(path.match(/^danh-muc/)){
		return 'category';
	}

	if(path.match(/^san-pham/)){
		return 'productDetail';
	}

	if(path.match(/^chinh-sach-doi-tra.html$/)){
		return 'return';
	}

	if(path.match(/^chinh-sach-thanh-toan.html$/)){
		return 'payment';
	}

	if(path.match(/^chinh-sach-giao-hang.html$/)){
		return 'delivery';
	}


	if(path.match(/^lien-he.html$/)){
		return 'contact';
	}

	if(path.match(/^dia-chi-giao-hang-mac-dinh.html$/)){
		return 'shippingDefault';
	}

	if(path.match(/^thong-tin-tai-khoan.html$/)){
		return 'show';
	}

	if(path.match(/^don-hang-cua-toi.html$/)){
		return 'orders';
	}



	return 'home';
}

exports.formatMoney = (money) => {
	const formatedMoney = numeral(money).format('0,0');
	return formatedMoney;
}

exports.getRouterCategory = (category) => {
	const slug = slugify(category.name , {lower: true});
	return `/danh-muc/${slug}/c${category.id}.html`;
}

// /san-pham/sua-rua-mat-cerave-sach-sau-cho-da-thuong-den-da-dau-473ml-102959.html
exports.getRouterProductDetail = (product) => {
	const slug = slugify(`${product.name}-${product.id}` , {lower: true});
	return `/san-pham/${slug}.html`;
}


exports.getOrderDetail = (product) => {
	return `/chi-tiet-don-hang-${order.id}.html`;
}

// người dùng gửi email cho hệ thống hệ thống bắt tin nhắn và gửi lại cho shop-Owner
exports.sendEmail = async(to, subject, content) => {
	const nodemailer = require("nodemailer");

	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST, // 
		port: 465,
		secure: true, // Use `true` for port 465, `false` for all other ports
		auth: {
		user: process.env.SMTP_USERNAME, //email của bạn
		pass: process.env.SMTP_SECRET,
		},
	  });

	  // send mail with defined transport object
	  const info = await transporter.sendMail({
		  from:  process.env.SMTP_USERNAME, // sender address
		  to: to, // list of receivers
		  subject: subject, // Subject line
		  html: content, // html body
	  });

	console.log("Message sent: %s", info.messageId);
	// Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

}

exports.getCurrentDateTime = () => {
	const { format } = require("date-fns");

	const now = format(new Date(), "yyyy-MM-dd H:mm:s");
	return now;
}

// lấy format của 3 ngày sau tính từ hôm nay
exports.getThreeLaterDateTime = () => {
    const { addDays, format } = require('date-fns');
    const today = new Date();
    const threeDaysLater = addDays(today, 3);//3 ngày sau tính từ hôm nay

    const datetime = format(threeDaysLater, 'yyyy-MM-dd H:mm:s');
    //=> '2023-12-02 10:04:17'
    return datetime;
}