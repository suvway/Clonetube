const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//postId는 동영상 Id responseTo는 대댓글일 경우 댓글을 단 사람의 아이디.
const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }
},{ timestamps: true})

const Comment= mongoose.model('Comment', commentSchema);

module.exports = { Comment }