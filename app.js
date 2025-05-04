const express = require('express');

const app = express();
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);  

// session
const session = require('express-session')
const FileStore = require('session-file-store')(session);

// cookie parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// hỗ trợ lấy dữ liệu post trong form bỏ vào req.body
const bodyParser = require('body-parser')



// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser);
app.use(urlencodedParser);

const hostname = '127.0.0.1';
const port = 3000;
// Để dùng khai báo cấu hình trong file .env


// khai báo ứng dụng sẽ dùng template engine là ejs
// Yêu cầu phải install module ejs trước
// ejs là embeded javascript template
app.set('view engine', 'ejs');


// khai báo thư mục view nằm ở đâu
// 2 tham số của hàm set
// tham số thứ nhất là views không đổi
// tham số thứ 2 là đường dẫn tuyệt đói
app.set('views', './views')

// chỉ định cái file css js image(file tĩnh) nằm ở đâu? 
// __dirname là đường dẫn chứa thư mục của file app đang chạy
app.use(express.static(__dirname + '/public'));

// session
app.use(session({
    store: new FileStore({}),
    secret: '123456',
    resave: false,
    saveUninitialized: true,
  }))

// trong use là 1 hàm callback function
// app.use là nơi các bạn cho middleware vào
const helpers = require('./utils/helpers')

// để view có thể truy cập vào biến helpers
// 
app.locals.helpers = helpers;

app.use((req, res, next) => {
  // thuộc tính trong locals sẽ trở thành tên biến trong view
  app.locals.currentRoute = helpers.getCurrentRoute(req.path);
  app.locals.session = req.session;
  next(); //phải có dòng này
})


// import indexRouter vào app
const indexRouter = require('./routers/IndexRouter');
app.use('/' ,indexRouter);

// const adminRouter = require('./routers/AdminRouter');
// app.use('/subject' ,adminRouter);



app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});