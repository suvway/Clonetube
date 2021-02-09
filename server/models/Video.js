const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const videoSchema = mongoose.Schema({
    
    writer : {
        type: Schema.Types.ObjectId,
        ref:'User'//User에 있는 모든 정보를 가져오려고 쓰는 것. type에서 불러올 것을 지정하고 ref에서 불러올 모델을 지정해준다.
    },
    title : {
        type: String,
        maxlength: 50
    },
    description : {
        type: String
    },
    privacy : {
        type: Number
    },
    filePath : {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }


}, { timestamp: true})//timestamp옵션을 줘서 만들 때와 업데이트 할 때 시간이 표시가 된다.




const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }