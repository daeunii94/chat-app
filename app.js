const createError = require('http-errors');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require("dotenv");


var session = require('express-session');
const flash = require('connect-flash');

const ColorHash = require('color-hash');

const webSocket = require('./socket');

const app = express();

const sessionMiddleware = session({
  key:  'sid',
  secret: 'GIFCHAT',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60, // 쿠키 유효기간 24시간
    httpOnly: true,
    secure: false,
  },
});



const { sequelize } = require('./models');

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV == "production" ? ".env" : ".env.dev"
  )
});



var indexRouter = require('./src/routes/pages/index');
var apiLoginRouter = require('./src/routes/api/v1/auth');
var apiBoardsRouter = require('./src/routes/api/v1/board');
var apiCommentsRouter = require('./src/routes/api/v1/comments');
var apiReplyBoardRouter = require('./src/routes/api/v1/replyboard');
var apiRoomRouter = require('./src/routes/api/v1/room');

var session = require('express-session');


//passportConfig(passport);
// passport.authenticate("jwt", {session: false});
// session or jwt
app.use(flash())
// cors 
 
// view engine setup
app.set('views', path.join(__dirname, './src/views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/photo', express.static(path.join(__dirname, 'uploads/images')));
app.use('/file', express.static(path.join(__dirname, 'uploads/files')));
app.use(express.json());


//시퀄라이저
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결됨.');
    }).catch((err) => {
        console.error(err);
    });


// logger
app.use(logger('dev'));

// bodyparser
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());




// public dirname
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(sessionMiddleware);


// 
app.use((req,res,next) => {
  if(!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
    
  }
  next();
})

// api router
app.use('/', indexRouter);
app.use('/api/v1/auth', apiLoginRouter);
app.use('/api/v1/board', apiBoardsRouter);
app.use('/api/v1/comments',apiCommentsRouter);
app.use('/api/v1/replyboard',apiReplyBoardRouter);
app.use('/api/v1/room',apiRoomRouter);



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
  res.render('error.pug');
});

const server = app.listen(process.env.PORT, process.env.HOST, function(){
	console.log('listening ' + process.env.NODE_ENV + ' ' + process.env.PORT+' port!!!');		
});


webSocket(server, app, sessionMiddleware);

module.exports = app;
