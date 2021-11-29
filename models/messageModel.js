const mongoose = require('mongoose')
const schema = mongoose.Schema

const messageSchema = new schema({
    user: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    }
})

const Msg = mongoose.model('chatmessages', messageSchema)
module.exports = Msg