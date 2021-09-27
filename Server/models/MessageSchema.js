const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    msg: String,
    sentTime: {
        type: String,
        default: (new Date()).toLocaleTimeString()
    },
    recieved: {
        type: Boolean,
        default: false
    },
    reciver: {
        type: mongoose.Types.ObjectId, ref: "User"
    }
})

module.exports = Message = new mongoose.model('Message', MessageSchema)