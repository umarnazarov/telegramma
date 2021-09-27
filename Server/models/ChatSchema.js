const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Types.ObjectId, ref: "Messages" }],
})

module.exports = Chat = new mongoose.model('Chat', chatSchema)

