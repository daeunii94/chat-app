var express = require('express');
var crypto = require('crypto');
var router = express.Router();
const loginServices = require("../../../services/auth");
const passportConfig = require("../../../configs/passport");

var fs = require('fs');
const mysql = require('mysql');
const parsed = require('../../../configs/mysql.json')
const pool = mysql.createPool(parsed);
var ChatRoom = require('../../../../models/chatRoom');
const axios = require('axios');

const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
var session = require('express-session');



var bcrypt = require('bcrypt');

const app = express();

// passport
app.use(passport.initialize()); //패스포트 등록

passportConfig();



console.log("parsed")
console.log(parsed.host)


/* GET home page. */
router.post('/', function (req, res, next) {

});
//localStorage.getItem("")

router.post('/out', function (req, res, next) {
  console.log("/login/out");
  // req.session.destroy(); 
  res.redirect('/login');
});

//패스포트 로그인 동시에 JWT 토큰 발행.t
router.post('/login', async (req, res, next) => {
  console.log(req.body)
  try {
    //로컬로 등록한 인증 과정 실행
    passport.authenticate('local', { session: false }, (passportError, user, info) => {
      console.log("인증 들어옴")
      console.log("user")
      console.log(user)

      //인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (passportError || !user) {
        console.log("인증 실패")
        //res.status(400).json({ message: info.reason });
        return;
      }

      req.login(user, { session: false }, async (loginError) => {
        if (loginError) {
          res.send(loginError);
          return;
        }
        console.log("success")
        // 클라이언트에게 JWT생성 후 반환
        const token = jwt.sign(
          { id: user.userIdEmail, name: user.userFullName, auth: user.auth },
          'jwt-secret-key',
          { expiresIn: 60 * 60 }
        );
        
        console.log('토큰 생성 완료 : ')
        console.log(token)

        req.session.userIdEmail = user.userIdEmail;
        res.cookie("user", token);
        res.redirect('/chatting')
        // res.json({
        //   jwtToken: token,
        // })
      });

    })(req, res, next);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.get('/token', (req,res,next) => {
//   try {
//     passport.authenticate('jwt', { session: false }, (passportError, user, info) =>{

//       res.send("asd");
//     })(req, res, next);
//   }catch(e){
//     console.log(e)
//   }
//   //res.send();
// });
router.post('/token', passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
	  try {
	    res.json({ result: true });
	  } catch (error) {
	    console.error(error);
	    next(error);
	  }
});
// router.post('/token', passport.authenticate('jwt', { session: false }),
// 	async (req, res, next) => {
// 	  try {
// 	    res.json({ result: true });
// 	  } catch (error) {
// 	    console.error(error);
// 	    next(error);
// 	  }
// });
// const JWTConfig = {
//   jwtFromRequest: ExtractJwt.fromHeader('authorization'),
//   secretOrKey: 'jwt-secret-key',
// };

// router.get('/myinfo', loginServices.CheckAuthentication, function (req, res) {
//   res.render('/main', {
//     title: 'My Info',
//     user_info: req.user
//   })
// });
//router.get('/users', passport.authenticate('jwt', {session:false}), loginServices.getUserByToken);

router.post('/signup', async (req, res, next) => {
  console.log("/login/signup");
  console.log("req.body : ")
  console.log(req.body)

  var dt = new Date();

  var body = req.body;
  var email = body.id;
  var name = body.name;
  var password = body.pw;
  var agency = body.agency_name;
  var postalCode = body.postalcode;
  var address = body.address;
  var address2 = body.address2;
  var phone = body.phone;
  var joinDate = dt.toFormat('YYYY-MM-DD HH24:MI:SS');

  var sql = 'insert into kdis.Users (userID, userIDEmail, userFullName, userPassword, userAddress, userAddress2, userPhone, userAgency, userJoinDate)'
    + 'values (?,?,?,?,?,?,?,?,?)'
  var datas = [email, email, name, password, address, address2, phone, agency, joinDate];

  pool.getConnection((err, conn) => {
    conn.query(sql, datas, (err, row) => {
      if (err) {
        console.log(err);
        res.end();
        //boardList로 이동요청     
      } else {
        console.log(row);
        console.log("Data inserted");
        res.redirect('/login')
      } 
    });
  });




});

module.exports = router;
