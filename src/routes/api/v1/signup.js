var express = require('express');
var crypto = require('crypto');
var dateutil = require('date-utils');
var router = express.Router();

var fs = require('fs');
const mysql = require('mysql');
const parsed = require('../../../configs/mysql.json')
const pool = mysql.createPool(parsed);

console.log("parsed")
console.log(parsed.host)

//회원가입
router.post('/signup', (req, res, next)=> {
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

  pool.getConnection((err,conn)=>{
    conn.query(sql, datas, (err, row)=>{
      if(err){
        console.log(err);
        res.end();
    //board/list로 이동요청     
      }else{
        console.log(row);
        res.render('board/list',{ title: 'list page', data:row});
        //res.json({success:true, data:row});
      }
    });
  });

});



module.exports = router;