var express = require('express');
var crypto = require('crypto');
var dateutil = require('date-utils');
var router = express.Router();

var fs = require('fs');
var Comment = require('../../../../models/comment');
var ReplyBoard = require('../../../../models/replyboard');


//console.log(parsed.host)

//show 1 reply board
router.get('/:replyBoardIdx', async (req, res, next) => {
    try {
        const replyBoard = await ReplyBoard.findOne(
            {where: {replyBoardIdx : req.params.replyBoardIdx}
        });
        console.log(replyBoard);
        //res.status(201).json(user);
        console.log('data show')
    } catch (err) {
        console.error(err);
        next(err);
    }
});



//create reply board
router.post(async (req, res, next) => {
    try {
        const replyBoard = await ReplyBoard.create({
            // 요청의 body에 parameter들이 담겨있음
            userIdx: req.body.userIdx,
            commentIdx: req.body.commentIdx,
            replyBoardTitle: req.body.replyBoardTitle,
            replyBoardContent: req.body.replyBoardContent,
            replyBoardImageURL: req.body.replyBoardImageURL,
        });
        console.log(replyBoard);
        //res.status(201).json(user);
        console.log('data inserted')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//update reply board
router.put('/:replyBoardIdx', async (req, res, next) => {
    try {
        const replyBoard = await ReplyBoard.update({
            commentIdx: req.body.commentIdx,
            replyBoardTitle: req.body.replyBoardTitle,
            replyBoardContent: req.body.replyBoardContent,
            replyBoardImageURL: req.body.replyBoardImageURL,
        }, {where: {replyBoardIdx : req.params.replyBoardIdx}});
        console.log(replyBoard);
        //res.status(201).json(user);
        console.log('data updated')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//delete reply board
router.delete('/:replyBoardIdx', async (req, res, next) => {
    try {
        const replyBoard = await ReplyBoard.destroy({
            where: {replyBoardIdx: req.params.replyBoardIdx}
        });
        console.log(replyBoard);
        //res.status(201).json(user);
        console.log('data deleted')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

  module.exports = router;