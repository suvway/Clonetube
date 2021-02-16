const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber")
const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

//=================================
//             Video
//=================================


//view단에서 /api/video/uploadfiles를 부르면 index.js를 거쳐서 오게된다.
//index.js => app.use('/api/video', requier('./routes/video')); 
//그러므로 router/video.js에서는 그 이후의 주소만 가지고 기능을 구현하면 된다.

const path = require("path");

//storage multer Config
let storage = multer.diskStorage({
    destination: (req, file, cb) =>{//file 저장 경로 
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)//역따옴표로 안에 펑션넣어줌
    }
});

// const fileFilter = (req, file, cb) => {
//     let ext = path.extname(file.originalname)
//     if(ext !== '.mp4'){
//     cb(Error, false);
//     }
//     cb(null, true)
// }

const upload = multer({storage: storage}).single("file");



router.post('/uploadfiles', (req, res) => {
    
    //비디오를 저장한다.
    upload(req, res, err =>{
        if(err) {
            return res.json({ success: false, err})
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename }) //return을 줄때 json에 파일 정보 전달
    })

})

router.post('/uploadVideo', (req, res) => {
    //비디오 정보를 mongoDb에 저장한다.
    const video = new Video(req.body)//Video Model을 위에서 import한 뒤에 req.body(Axios를 통해서 보낸 variables)를 넣어서 새로운 객체 생성한다.
    
    video.save((err, doc) => {
        if(err) { return res.json({ success: false, err}) 
        } else {
            return res.status(200).json({ success: true })
        }
    })
})



router.get('/getVideos', (req, res) => {
    //비디오를 DB에서 가져와서 클라이언트에 보낸다.
    //find() 메소드를 이용해서 video collection 에 있는 모든 video를 가져온다. 
    
    Video.find()//populate을 이용해서 upload할 때 type에 objectId에 저장된 user에 정보를 불러 올 수 있다. 즉 참조하는 것이다.
        .populate('writer')//populate하지 않으면 그냥 id만 가져오게된다.
        .exec((err, videos) => {
            if(err) {
                return res.status(400).send(err)
            } else {
                res.status(200).json({ success: true, videos})
            }
        })

})



router.post('/getVideoDetail', (req, res) => {
    
    //populate을 통해 비디오에 있는 유저정보도 함께 보낸다. 
    Video.findOne({"_id" : req.body.videoId})//post받은 body에 있는 id를 이용해서 id를 검색한다.
    .populate('writer')
    .exec((err, videoDetail) => {
        if(err) {return res.status(400).send(err)
        } else {
            return res.status(200).json({ success: true, videoDetail})
        }
    })
})



router.post('/thumbnail', (req, res) => {
    
    //썸네일을 생성하고 비디오 러닝타임도 가져오기

    let filePath = "";
    let fileDuration = "";
    
    
    //비디오 정보 가져오기 ffmpeg랑 같이 설치되는 ffprobe에서 정보를 가져온다.
    ffmpeg.ffprobe(req.body.url, function (err, metadata){
        console.log(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration

    });

    //썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
        console.log('Will generate' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function () {
        console.log('Screenshots taken')
        return res.json({success: true, url: filePath, fileDuration: fileDuration});
    })
    .on('error', function(err){
        console.error(err);
        return res.json({success:false, err});
    })
    .screenshot({
        //Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        //'%b': input basename(filename with out extension)
        filename: 'thumbnail-%b.png'
    })
}) 

router.post('/getSubscriptionVideos', (req, res) => {
    //자신의 아이디를 가지고, 구독하는 사람들을 찾는다.
    //Subscriber모델에서 검색한다.
    Subscriber.find({ userFrom: req.body.userFrom })
    .exec((err, subscriberInfo) => {
        if(err) res.status(400).send(err);

        let subscribedUser = [];
        
        subscriberInfo.map((subscriber, i) => {
            subscribedUser.push(subscriber.userTo);
        })
        //찾은 사람들의 비디오를 가지고 온다.
        //위에서 찾은 userTo를 가지고 있는 변수 subscribedUser는 배열 즉 여러개 일 수 있기 때문에 그냥 담아서 몽고디비에서 검색 할 수 없다.
        //그래서 새로운 몽고디비 기능인 $in을 사용한다.
        Video.find({ writer : {$in: subscribedUser}})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos})
            })
    })

})


module.exports = router;