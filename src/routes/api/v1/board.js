var express = require('express');
var crypto = require('crypto');
var dateutil = require('date-utils');
var router = express.Router();

var fs = require('fs');
const mysql = require('mysql');
const parsed = require('../../../configs/mysql.json')
const pool = mysql.createPool(parsed);

var Comment = require('../../../../models/comment');
var Board = require('../../../../models/board')
var BoardLike = require('../../../../models/boardLike');
const { request } = require('http');


console.log("parsed")
console.log(parsed.host)

//처음 리스트는 /list/1로 리다이렉트
router.get('/posts-list', (req, res, next) => {
  console.log("/posts-list")
  console.log("req.session : ")
  console.log(req.session)
  res.redirect('posts-list/1');
});

//페이지별 게시글 list 
router.get('/posts-list/:currentPage', (req, res, next) => {
  console.log("posts list 요청")

  //페이징    
  let rowPerPage = 10;    // 페이지당 보여줄 글목록 : 10개
  let currentPage = 1;
  if (req.params.currentPage) {
    currentPage = parseInt(req.params.currentPage);
  }
  let beginRow = (currentPage - 1) * rowPerPage;
  console.log(`currentPage : ${currentPage}`);
  let model = {};

  pool.getConnection((err, conn) => {
    //행 개수 구하는 쿼리 실행
    conn.query('SELECT COUNT(*) AS cnt FROM kdis.Board', (err, result) => {  //전체 글목록 행 갯수 구하기
      if (err) {
        console.log(err);
        res.end();
      } else {
        console.log(`totalRow : ${result[0].cnt}`);
        let totalRow = result[0].cnt;
        lastPage = totalRow / rowPerPage;
        if (totalRow % rowPerPage != 0) {
          lastPage++;
        }
      }
      //쿼리문 작성, 실행, model영역에 세팅, 포워드 방식으로 boardList화면 출력
      conn.query('select boardIdx, boardTitle, boardCreatedDate, boardUpdateDate from kdis.Board ORDER BY boardIdx DESC LIMIT ?,?'
        , [beginRow, rowPerPage], (err, rs) => {
          if (err) {
            console.log(err);
            res.end();
          } else {
            model.boardList = rs;
            model.currentPage = currentPage;
            model.lastPage = lastPage;
            //res.json({success:true, data:model});
            res.render('board/list', { title: 'list page', data: rs });

          }
        });
    });
  });

});

// //show
// router.get('/posts/:postIdx', (req, res, next) => {
//   var idx = req.params.postIdx;
//   var sql = "select boardIdx, boardTitle, boardContent, boardCreatedDate, boardUpdateDate, boardImageURL from kdis.Board where boardIdx=?";

//   pool.getConnection((err, conn) => {
//     conn.query(sql, [idx], (err, row) => {
//       if (err) {
//         console.log(err);
//         res.end();
//         //boardList로 이동요청     
//       } else {
//         console.log(row);
//         //res.json({success:true, data:row});
//         res.render('board/read', { title: 'show post', data: row });
//       }
//     });
//   })

// });

//create
router.post('', (req, res, next) => {
  console.log("/posts");
  console.log("req.body : ");
  console.log(req.body);

  var dt = new Date();
  var body = req.body;

  var userIdx = body.userIdx;
  var boardTitle = body.boardTitle;
  var boardContent = body.boardContent;
  var boardCreatedDate = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
  var boardImageUrl = body.boardImageUrl;
  var datas = [userIdx, boardTitle, boardContent, boardCreatedDate, boardImageUrl];

  var sql = 'insert into kdis.Board(userIdx, boardTitle, boardContent, boardCreatedDate, boardImageURL) values(?,?,?,?,?)';

  pool.getConnection((err, conn) => {
    conn.query(sql, datas, (err, row) => {
      if (err) {
        console.log(err);
        res.end();
        //board/list로 이동요청     
      } else {
        console.log(row);
        res.render('board/list', { title: 'list page', data: row });
        //res.json({success:true, data:row});
      }
    });
  });

});

//delete
router.delete('/:postIdx', function (req, res, next) {
  console.log("/posts");
  console.log("req.body : ");
  console.log(req.body);

  var dt = new Date();

  var body = req.body;
  var postIdx = req.params.postIdx;
  var boardUpdateDate = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
  var datas = [boardUpdateDate, postIdx];

  var sql = 'update kdis.Board set boardIsActive=0, boardUpdateDate=? where boardIdx=?';

  pool.getConnection((err, conn) => {
    conn.query(sql, datas, (err, row) => {
      if (err) {
        console.log(err);
        res.end();
        //boardList로 이동요청     
      } else {
        console.log(row);
        res.render('board/list', { title: 'list page' });
        //res.json({success:true, data:row});
      }
    });
  });

});

//update
router.put('/:postIdx', (req, res, next) => {
  console.log("/:postIdx");
  console.log("req.body : ");
  console.log(req.body);

  var idx = req.params.postIdx;
  var dt = new Date();

  var body = req.body;
  var boardIdx = body.boardIdx;
  var boardTitle = body.boardTitle;
  var boardUpdateDate = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
  var boardContent = body.boardContent;
  var boardImageUrl = body.boardImageUrl;
  var datas = [boardTitle, boardUpdateDate, boardImageUrl, boardContent, idx];

  var sql = "update kdis.Board set boardTitle=?, boardUpdateDate=?, boardImageURL=?, boardContent=? where boardIdx=?";

  pool.getConnection((err, conn) => {
    conn.query(sql, datas, (err, row) => {
      if (err) {
        console.log(err);
        res.end();
        //boardList로 이동요청     
      } else {
        console.log(row);
        //res.json({success:true, data:row});
        res.render('board/list', { title: 'list page' });

      }
    });
  });
});


//show post+comments (sequelizer 사용) 
router.get('/:id', async (req, res, next) => { //null값..
  Promise.all([
    Board.findOne({ where: { boardIdx: req.params.id } }),
    Comment.findAll({ where: { boardIdx: req.params.id } })
  ])
    .then(([board, comments]) => {
      //res.render('board/read', { board:board, comments:comments});
      console.log(board)
      console.log(comments)
      console.log('data listed')
    })
    .catch((err) => {
      console.log('err: ', err);
      return res.json(err);
    });


});


//post에 comment 달기
router.post('/:boardIdx/comment', async (req, res, next) => {
  try {
    const comment = await Comment.create({
      // 요청의 body에 parameter들이 담겨있음
      boardIdx: req.params.boardIdx,
      userIdx: req.body.userIdx,
      commentContent: req.body.commentContent,
      commentCreatedDate: req.body.commentCreatedDate
    });
    console.log(comment);
    //res.status(201).json(user);
    console.log('data inserted')
  } catch (err) {
    console.error(err);
    next(err);
  }

});

//post like
router.post('/:boardIdx/like', (req, res, next) => {
  console.log(req.params.boardIdx)

  BoardLike.findOrCreate({
    where:{
      boardIdx: req.params.boardIdx,   
      userIdx: req.body.userIdx,
    }, 
    defaults: {
      boardIsLike: true
    //properties you want on create
    }
  }).then( function(tag){
    console.log(tag[0].dataValues)
    res.json("d")
    console.log(tag[0].dataValues.boardIsLike)
    var isValid = tag[0].dataValues.boardIsLike ? false : true
    BoardLike.update({
      // 요청의 body에 parameter들이 담겨있음
      boardIsLike: isValid,
      },
      {where:{boardLikeIdx: tag[0].dataValues.boardLikeIdx}
    }).catch(function(err) {
      console.log(err)
    })
  })
})


// //board와 해당되는 comment 
// router.get('/:id', async (req, res, next) => { //null값..
//   Promise.all([
//     Board.findOne({ where: { boardIdx: req.params.id } }),
//     Comment.findAll({ where: { boardIdx: req.params.id } })
//   ])
//     .then(([board, comments]) => {
//       //res.render('board/read', { board:board, comments:comments});
//       console.log(board)
//       console.log(comments)
//       console.log('data listed')
//     })
//     .catch((err) => {
//       console.log('err: ', err);
//       return res.json(err);
//     });
// });

module.exports = router;
