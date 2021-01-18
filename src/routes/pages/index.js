var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

var router = express.Router();
//var flash = require('connect-flash'); 

var Chat = require('../../../models/chat');
var ChatRoom = require('../../../models/chatRoom');
var ChatGroupMember = require('../../../models/chatGroupMember');
var ChatRead = require('../../../models/chatRead');

const { sequelize } = require('../../../models/chat');
var session = require('express-session');
const Op = require('sequelize').Op;

const passport = require('passport');
const mysql = require('mysql');
const parsed = require('../../configs/mysql.json')
const pool = mysql.createPool(parsed);

//

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/login');
});
 
router.get('/chatting', async (req, res, next) => {
  //let token = req.cookies.user;
  try {
    const rooms = await ChatRoom.findAll({});
    // req.session.ownerIdx = rooms[0].length + 1
    //console.log("!!!" + req.session.color)
    console.log(rooms)

    res.render('main.pug', { rooms, title: 'GIF 채팅방', error: req.flash('roomError') });
  } catch (error) {
    console.log("err")
    console.error(error);
    next(error);
  }
});


router.get('/room', function (req, res, next) {
  res.render('room.pug', { title: 'GIF 채팅방 생성' });
});
 
router.post('/room', async (req, res, next) => {
  try {
    const room = new ChatRoom({
      chatRoomTitle: req.body.title,
      chatRoomOwner: req.session.userIdEmail,
      //chatUserIdEmail : req.session.userIdEmail

    });

    const newRoom = await room.save();
    const io = req.app.get('io');
    //console.log(req.session.color)
    io.of('/room').emit('newRoom', newRoom); //
    res.redirect(`/room/${newRoom.chatRoomIdx}`);// 방에 접속하는 라우터
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room/:roomIdx', async (req, res, next) => {
  console.log(req.params.roomIdx)
  const room = await ChatRoom.findOne({ where: { chatRoomIdx: req.params.roomIdx } });

  //방 새로 참여하거나 다시 입장하면 true
  ChatGroupMember.findOrCreate({
    where: {
      chatRoomIdx: req.params.roomIdx,
      chatUserIdx: req.session.userIdEmail
    },
    defaults: {
      groupIn: false
      //properties you want on create
    }
  }).then(function (tag) {
    var inOut = tag[0].dataValues.groupIn ? false : true
    ChatGroupMember.update({
      // 요청의 body에 parameter들이 담겨있음
      groupIn: inOut,
    },
      {
        where: { chatRoomIdx: tag[0].dataValues.chatRoomIdx, chatUserIdx: tag[0].dataValues.chatUserIdx }
      }).then(function (tag) {

        var sql = 'insert into kdis.ChatRead(chatUserIdx, chatIdx, chatRoomIdx) select gm.chatUserIdx, c.chatIdx, c.chatRoomIdx from kdis.ChatGroupMembers gm cross join kdis.Chats c on c.chatRoomIdx = gm.chatRoomIdx left join kdis.ChatRead cr on cr.chatIdx=c.chatIdx and cr.chatUserIdx=gm.chatUserIdx where cr.chatUserIdx IS NULL and gm.chatUserIdx=? ';
        console.log("userIdx:")
        const userIdx = req.session.userIdEmail;
        console.log(userIdx)
        pool.getConnection((err, conn) => {
          conn.query(sql, [userIdx], (err, rows) => {
            if (err) {
              console.log(err)
              res.end();
            } else { 
              console.log("성공~~~~")
            }
          })
        })
      }).catch(function (err) {
        console.log(err)
      })
  })

  //chatGroupMember.save();
  console.log("room")
  console.log(room)
  const io = req.app.get('io');
  if (!room) {
    req.flash('roomError', '존재하지 않는 방입니다.');
    return res.redirect('/');
  }

  const chats = await Chat.findAll({ where: { chatRoomIdx: room.chatRoomIdx } });

  return res.render('chat', {
    room,
    title: room.chatRoomTitle,
    chats,
    user: req.session.userIdEmail,

  });
});


//방에서 나갔을 때
router.delete('/room/:id/user/:userId/out', async (req, res, next) => {
  console.log(req.session.userIdEmail)
  await ChatGroupMember.update({ groupIn: false }, { where: { chatRoomIdx: req.params.id, chatUserIdx: req.params.userId } });

})

router.delete('/room/:id', async (req, res, next) => {
  try {
    await ChatRoom.destroy({ where: { chatRoomIdx: req.params.id } });
    await Chat.destroy({ where: { chatRoomIdx: req.params.id } });
    await ChatGroupMember.destroy({ where: { chatRoomIdx: req.params.id } });
    await ChatRead.destroy({ where: { chatRoomIdx: req.params.id } });

    res.send('ok');
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);

  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      chatRoomIdx: req.params.id,
      chatUserIdx: req.session.userIdEmail,
      chatDetail: req.body.chat,
      chatUserColor: req.session.color
    });
    chat.save();

    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);

    //해당 방에 있는 사람들은 채팅방의 마지막 채팅 읽음 표시
    const sql = 'insert into kdis.ChatRead(chatUserIdx,chatIdx, chatRoomIdx) SELECT gm.chatUserIdx, c.chatIdx, c.chatRoomIdx FROM kdis.Chats c join kdis.ChatGroupMembers gm on c.chatRoomIdx = gm.chatRoomIdx where c.chatIdx= (select chatIdx from kdis.Chats order by chatIdx DESC limit 1) and gm.groupIn = true'

    pool.getConnection((err, conn) => {
      conn.query(sql, (err, row) => {
        if (err) { 
          console.log(err)
          res.end();
        } else {
          console.log("success!!!")
        }
      })
    })


  } catch (error) {
    console.error(error);
    next(error);
  }



});

fs.readdir('uploads/images/', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads/images/');
  }
});

fs.readdir('uploads/files/', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads/files/');
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const ext = path.extname(file.originalname);

      if (ext === '.png' || ext === '.gif' || ext === '.jpeg' || ext === '.bmp')
        cb(null, 'uploads/images/');
      else
        cb(null, 'uploads/files/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);  //확장자
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); //중복방지 날짜

      console.log(file.originalname)
      console.log(ext)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, //10megabyte까지 
});


router.post('/room/:id/file', upload.single('file'), async (req, res, next) => {
  try {

    const chat = await Chat.create({
      chatRoomIdx: req.params.id,
      chatUserIdx: req.session.color,
      chatFile: req.file.filename,
    });
    console.log("file")
    console.log(chat.chatFile)
    await chat.save();
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/room/:id/photo', upload.single('photo'), async (req, res, next) => {
  try {

    const chat = await Chat.create({
      chatRoomIdx: req.params.id,
      chatUserIdx: req.session.color,
      chatPhoto: req.file.filename,
    });
    console.log("photo")
    console.log(chat.chatPhoto)
    await chat.save();
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }

});

router.get('/home', function (req, res, next) {
  var sess = req.session;
  console.log(sess);
  res.render('home', { title: 'home', msg: '로그인 했습니다' });
});

router.get('/login', function (req, res, next) {
  console.log("/login")
  res.render('login.ejs', { title: 'KDIS 로그인', msg: '이메일과 패스워드를 입력해주세요' });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'KDIS 회원가입' });
});


router.get('/main', function (req, res, next) {
  var sess = req.session;

  console.log(sess.userid);

  res.render('main', {
    title: "MY HOMEPAGE",

  })
});

module.exports = router;
