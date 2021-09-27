const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    image: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/netflix-fcdc4.appspot.com/o/userImg.png?alt=media&token=3c76ef44-03d9-412f-92ac-d3c5a3e51bba"
    },
    name: {
        type: String,
        required: true
    },
    online: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    isAdmin: false,
    chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }],
    contacts: [{ type: mongoose.Types.ObjectId, ref: "Contact" }]
})


module.exports = User = new mongoose.model('User', userSchema)