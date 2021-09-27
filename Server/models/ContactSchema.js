const mongoose = require('mongoose')

const contacSchema = new mongoose.Schema({
    contact: { type: mongoose.Types.ObjectId, ref: "User" }
})

module.exports = Contact = new mongoose.model('Contact', contacSchema)