var express = require('express');

var Chat = require('../../../../models/chat');
var ChatRoom = require('../../../../models/chatRoom');

var router = express.Router();

router.get('', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성' });
  });
  
  router.post('', async (req, res, next) => {
    try {
      const room = new Room({
        title: req.body.title,
        max: req.body.max,
        owner: req.session.color,
        password: req.body.password,
      });
      const newRoom = await room.save();
      const io = req.app.get('io');
      io.of('/room').emit('newRoom', newRoom);
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  router.get('/:id', async (req, res, next) => {
    try {
      const room = await Room.findOne({ _id: req.params.id });
      const io = req.app.get('io');
      if (!room) {
        req.flash('roomError', '존재하지 않는 방입니다.');
        return res.redirect('/');
      }
    //   if (room.password && room.password !== req.query.password) {
    //     req.flash('roomError', '비밀번호가 틀렸습니다.');
    //     return res.redirect('/');
    //   }
    //   const { rooms } = io.of('/chat').adapter;
    //   if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
    //     req.flash('roomError', '허용 인원이 초과하였습니다.');
    //     return res.redirect('/');
    //   }
      return res.render('chatting/chat', {
        room,
        title: room.title,
        chats: [],
        user: req.session.color,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  
  router.delete('/:id', async (req, res, next) => {
    try {
      await Room.remove({ _id: req.params.id });
      await Chat.remove({ room: req.params.id });
      res.send('ok');
      setTimeout(() => {
        req.app.get('io').of('/room').emit('removeRoom', req.params.id);
      }, 2000);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  

module.exports = router;