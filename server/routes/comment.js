const express = require('express');
const router = express.Router();

const { Comment } = require("../models/Comment");

//=================================
//             Comment
//=================================

router.post('/saveComment', (req, res) => {
    //mongo디비에 저장하기 위헤서 새로운 모델을 만든다. body를 넣어서
    //로그인을 필수로 하기위해서는 comment model을 만들 때 required: true 옵션을 주거나
    //아래와 같은 옵션을 주면 여기서 검사해서 보내준다.
    //if(req.body.writer === undefined) return res.status(200).json({ success: false})
    const comment = new Comment(req.body)
    comment.save((err, comment) => {
        if(err) return res.json({ success: false, err })
        //comment를 그냥 return해줄경우 유저의 정보가 모두 안들어있기 때문에 comment의 정보를 이용해서 id를 Db에서 검색해서 그걸 보내준다.

        Comment.find({'_id' : comment._id})
            .populate('writer')
            .exec((err, result) => {
                if(err) return res.json({ success: false, err })
                res.status(200).json({ success: true, result })
            })
    })
})

router.post('/getComments', (req, res) => {
    //model을 만들 때 postId가 아니라 videoId가 더 가독성이 좋았을 것이다.
    Comment.find({ "postId": req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
        if(err) return res.status(400).json({ sucess: false, err})
        res.status(200).json({ success: true, comments})
    })
});

//export 까먹지말자 index.js 에서 router를 설정할 때 require를 통해서 가져오기 때문에 모듈을 export해줘야한다.
module.exports = router;