var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


//added
var session = require('express-session');
var fileUpload = require('express-fileupload');


//router
var indexRouter = require('./routes/index');
var testingRouter = require('./routes/testing');
var dbRouter = require('./routes/db');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(fileUpload());// req.files
app.use(express.json());//"application/json" -> req.body
app.use(express.urlencoded({ extended: false }));//application/x-www-form-urlencoded -> req.body
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:"mySecret", //bad secret
  resave:true,
  saveUninitialized:true,
}));
app.use(cors({
  origin:"http://localhost:5500",
  credentials:true
}))
// app.use((req,res,next)=>{
//   res.header('Access-Control-Allow-Origin','http://localhost:5500')// the usual live server
//   res.header('Access-Control-Allow-Methods','GET,POST')
//   res.header('Access-Control-Allow-Headers','Content-Type, Authorization')
//   res.header('Access-Control-Allow-Credentials','Content-Type, Authorization')
//   // res.header('Access-Control-Allow-Headers','*')
  
//   console.log(req.body);
//   next();
// })
//TODO session store (company_id)
//for now we will use default server-side session storage, MemoryStore //FIXME


app.use('/', indexRouter);
app.use('/db', dbRouter);
app.use('/testing', testingRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
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

/* 
curl localhost:3000/
curl localhost:3000/testing
curl localhost:3000/testing 
  -X POST
  -body: 


*/
