var express = require('express');
var crypto = require('crypto');
var dateutil = require('date-utils');
var router = express.Router();

var fs = require('fs');
const Comment = require('../../../../models/comment');
const Board = require('../../../../models/board');


//console.log(parsed.host)

//create comment
// router.post('/:boardId', async (req, res, next) => {
//     try {
//         const comment = await Comment.create({
//             // 요청의 body에 parameter들이 담겨있음
//             boardIdx: req.params.boardId,
//             userIdx: req.body.userIdx,
//             commentContent: req.body.commentContent,
//             commentCreatedDate: req.body.commentCreatedDate
//         });
//         console.log(comment);
//         //res.status(201).json(user);
//         console.log('data inserted')
//     } catch (err) {
//         console.error(err);
//         next(err);
//     }
// });

//update comment
router.put('/:id', async (req, res, next) => {
    try {
        const comment = await Comment.update(
            {
            // 요청의 body에 parameter들이 담겨있음
            commentContent: req.body.commentContent,
            },
            {where:{boardIdx: req.params.id}}
        );
        console.log(comment)
        //res.status(201).json(user);
        console.log('data updated')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//delete
router.delete('/:id', async (req, res, next) => {
    try {
        const comment = await Comment.destroy({
            where:{boardIdx: req.params.id}
        });
        console.log(comment);
        //res.status(201).json(user);
        console.log('data deleted')
    } catch (err) {
        console.error(err);
        next(err);
    }
});


router.get('/posts/:postIdx', (req, res, next)=> {
    var idx = req.params.postIdx;
    var sql = "select boardIdx, boardTitle, boardContent, boardCreatedDate, boardUpdateDate, boardImageURL from kdis.Board where boardIdx=?";
  
    pool.getConnection((err, conn)=>{
      conn.query(sql, [idx], (err, row)=>{
        if(err){
          console.log(err);
          res.end();
      //boardList로 이동요청     
        }else{
          console.log(row);
          //res.json({success:true, data:row});
          res.render('board/read',{ title: 'show post', data:row});
        }
      });
    });
  
  });



  module.exports = router;