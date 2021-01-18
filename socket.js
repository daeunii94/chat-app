const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' }); //익스프레스와 소켓 연결
  app.set('io', io); //익스프레스 변수 저장 방법
  
  //req.app.get('io').of('/room').emit
  //네임스페이스
  //io
  //불필요한 실시간 정보 안받음
  const room = io.of('/room');
  const chat = io.of('/chat');


  //익스프레스 미들웨어를 소켓IO에서 사용. 꼭 알아두기! 익스프레스 세션 사용.
  io.use((socket, next) => { 
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  //room namespace
  room.on('connection', (socket) => { 
    console.log('room 네임스페이스에 접속');

    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });


  //chat namespace
  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
 
    const req = socket.request; 
    
    const { headers: { referer } } = req;
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
        //room/asdqwdsaffds (req.headers.referer)

    //console.log(req);
    console.log(socket.connected)
    console.log(socket.id);
    console.log(socket.disconnected)

    // console.log(roomId);
    socket.join(roomId);
    
    //axios.get(`http://localhost:4000/room/${roomId}/joinChat/${req.session.userIdEmail}`) 

    console.log("!!"+req.session.userIdEmail)
    socket.to(roomId).emit('join', { //to.emit->그 방에만 메세지 보냄 
      user: `${req.session.userIdEmail}`, 
      chat: `${req.session.userIdEmail}님이 입장하셨습니다.`, 
    },

    );

    socket.on('disconnect', () => { 
      console.log('chat 네임스페이스 접속 해제'); 
      socket.leave(roomId); //방 나가기 
      
      axios.delete(`http://localhost:4000/room/${roomId}/user/${req.session.userIdEmail}/out`)
  
      const currentRoom = socket.adapter.rooms[roomId]; 
      const userCount = currentRoom ? currentRoom.length : 0; 
      //방에 인원이 하나도 없으면 방 제거
      if (userCount === 0) { 
        //여기에 디비 조작하지 말고 라우터를 통해 디비 조작하는 것이 가독성 좋음

        axios.delete(`http://localhost:4000/room/${roomId}`) 
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.log("err")
            console.error(error);
          });
      } else { //남은 인원이 있을 때 
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.userIdEmail}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};