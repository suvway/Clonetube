const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{ timestamps: true})
// Subscriber model을 subcriberSchema로 감싸서 만든다음 상수 Subscriber에 담아준다. 후에 모듈을 내보내서 만든 model을 쓸 수 있게 한다.
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }