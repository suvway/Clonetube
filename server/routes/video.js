const express = require('express');
const router = express.Router();
//const { Video } = require("../models/Video");

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


module.exports = router;