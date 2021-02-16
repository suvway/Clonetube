const express = require('express');
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscriber
//=================================

router.post("/subscribeNumber", (req, res) => {

    Subscriber.find({'userTo' : req.body.userTo})
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length})
    })


});

router.post("/subscribed", (req, res) => {
    //userTo와 userFrom을 모두 가지는 데이터를 찾는것이다.
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, subscribe) =>{
        if(err) return res.status(400).send(err);
        let result = false;
        //올린사람과 누른사람이 겹치는 항목이 있으면 result를 true로 바꾼다.
        if(subscribe.length !== 0){
            result = true;
        }
        res.status(200).json({ success: true, subscribed: result})
    })


});


router.post("/unSubscribe", (req, res) =>{
    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom})
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success: false, err})
        res.status(200).json({ success: true, doc})
    })
});


router.post("/Subscribe", (req, res) =>{


    const subscribe = new Subscriber(req.body)

    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        res.status(200).json({ success: true})
    })

});

//export 까먹지말자 index.js 에서 router를 설정할 때 require를 통해서 가져오기 때문에 모듈을 export해줘야한다.
module.exports = router;