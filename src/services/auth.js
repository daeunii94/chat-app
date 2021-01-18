const { compare, hash } = require("../helpers/bcrypt");
const { query } = require("../helpers/mysql");
const { sign, verify } = require("../helpers/jwt");
const message = require("../libs/message");
var passport = require('passport') 
const jwt = require('jsonwebtoken');


//{ successRedirect: '/chatting', failureRedirect: '/login', failureFlash: true }
// //로그인 시 토큰 발생
// const AuthTokenController = (req, res, next) => {
//   // eslint-disable-next-line consistent-return
//   passport.authenticate("local", { session: false }, (err, user) => {
//     if (err || !user) return res.status(400).end();
//     req.login(user, { session: false }, (error) => {
//       if (error) next(error);
//       const token = jwt.sign(
//         {
//           uid: user.uid, 
//         }, // 토큰에 입력할 private 값
//         env.dev.JWT_SECRET, // 나만의 시크릿키
//         { expiresIn: "5m" } // 토큰 만료 시간
//       );
//       return res.json({ token });
//     });
//   })(req, res);
// }

// //로그인 유저 판단
// const CheckAuthentication = (req, res, next) =>{ 
//   if (req.isAuthenticated())
//       return next();
//   res.redirect('/login');
// }

// const AuthTokenController = (req, res)=> {
//   console.log(req.body)
//   passport.authenticate('local', {session: false}, (err, user) => {
//     console.log(err)
//     console.log("AuthTokenController")
//       if (err || !user) {
//           return res.status(400).json({
//               message: 'Something is not right',
//               user   : user
//           });
//       }
//       req.login(user, {session: false}, (err) => {
//           if (err) {
//               res.send(err);
//           }
//           // jwt.sign('token내용', 'JWT secretkey')
//           const token = jwt.sign(user, process.env.JWT_SECRET);
//           return res.json({user, token});
//       });
//   })(req, res);
// };



// module.exports = { AuthTokenController};
