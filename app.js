var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var data = require('./models/danh_sach_tai_khoan_admin');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var path = require('path');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');
var mainRouter = require('./routes/main');
var danh_sach_tai_khoan_Router = require('./routes/danh_sach_tai_khoan_Router');
var danh_sach_cho_duyet_Router = require('./routes/danh_sach_cho_duyet_Router');
var danh_sach_cua_hang_Router = require('./routes/danh_sach_cua_hang_Router');
var danh_sach_san_pham_Router = require('./routes/danh_sach_san_pham_Router');
var danh_sach_loai_san_pham_Router = require('./routes/danh_sach_loai_san_pham_Router');
var don_hang_Router = require('./routes/don_hang_Router');
var danh_sach_nguoi_nhan_Router = require('./routes/danh_sach_nguoi_nhan_Router');
var giao_hang_Router = require('./routes/giao_hang_Router');
var da_giao_Router = require('./routes/da_giao_Router');

var app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://dat:dat251@cluster0-jslyd.mongodb.net/WebDB?retryWrites=true';
// mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.connect(mongoDB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// Express Session
app.use(session({
    secret: 'anything',
    saveUninitialized: false,
    resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// ROUTE SECTION ###########

app.use('/', indexRouter)
app.use('/main', mainRouter);
app.use('/danh_sach_tai_khoan', danh_sach_tai_khoan_Router);
app.use('/danh_sach_cho_duyet', danh_sach_cho_duyet_Router);
app.use('/danh_sach_cua_hang', danh_sach_cua_hang_Router);
app.use('/danh_sach_san_pham', danh_sach_san_pham_Router);
app.use('/danh_sach_loai_san_pham', danh_sach_loai_san_pham_Router);
app.use('/danh_sach_nguoi_nhan', danh_sach_nguoi_nhan_Router);
app.use('/don_hang', don_hang_Router);
app.use('/dang_giao', giao_hang_Router);
app.use('/da_giao', da_giao_Router);
app.use('/da_giao', da_giao_Router);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

function doTheCompare(passInput, passReal) {
  bcrypt.compare(passInpunot, passReal, (err, res)=>{
    if(!err){
        console.log(passInput);
        console.log(passReal);
      return res;
    }else{
      console.log('Error', err);
    }
  })
}

passport.use('local', new LocalStrategy({
         passReqToCallback: true
    },
    async function (req, username, password, done) {
       console.log("begin search!");
        await data.find({"name":username})
          .exec(function (err, item) {

            if (err) {
              console.log("find false!");
              return done(null, false);
            }
            else {
              if(item.length == 0)
              {
                  console.log(username);
                console.log("name false!");
                req.authError = "Sai tên đăng nhập";
                return done(null, false);
              }
              else {
                  try {
                      console.log(req.body.password);
                      console.log(item[0].password);
                      bcrypt.compare(req.body.password, item[0].password, (err, res) => {
                          if (!err) {
                              if (res) {
                                  const user = item[0];
                                  return done(null, user);

                              } else {
                                  console.log("password false!");
                                  req.authError = "Sai mật khẩu";
                                  return done(null, false);
                              }

                          } else {
                              console.log('Error: ' + err);
                              req.authError = "Lỗi, nhập lại!";
                              return done(null, false);
                          }
                      })
                  }
                  catch (e) {
                      console.log('Error tryCatch: ' + e);
                  }


              }
            }
            ;
          });
    }));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.post('/login',
    passport.authenticate('local', {
      failWithError: true
    }),
    function (req, res) {
      res.redirect('/main');
    },
    function (err, req, res, next) {

      if (req.authError) {
        console.log("login false!");
        res.render('dang_nhap', {
          errorText: req.authError
        });
      }
    }
);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("lỗiiiiiiiiiiiiii");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
