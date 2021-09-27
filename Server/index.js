const cors = require("cors")
const Pusher = require("pusher");
const express = require('express')
const passport = require('passport')
const mongoose = require("mongoose")
const session = require("express-session")
const MemoryStore = require('memorystore')(session)
const cookieParser = require("cookie-parser")
const telegramma = require('./routes/api/telegramma');
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 5000

// MIDLS //
app.enable("trust proxy")
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "https://webtelegramma.netlify.app", credentials: true, optionsSuccessStatus: 200 }));
app.use(session({
    cookie: {
        maxAge: 86400000,
        sameSite: "none",
        secure: "true"
    },
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat'
}))
// app.use(session({ secret: "notsecret",  resave: true, cookie: { maxAge: 60000 } }))
app.use(cookieParser("notsecret"))

app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)

// DB Pusher //
const pusher = new Pusher({
    appId: "1257181",
    key: "6b4bc3647f287c21f650",
    secret: "f6771e7164123323c5aa",
    cluster: "ap2",
    useTLS: true
});

// Database Connection //
mongoose.connect('mongodb+srv://umarnazarov:324422116@cluster0.co4sc.mongodb.net/Telegramma?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('Database was connected successfully'))
    .catch(() => console.log("Error accuried in database"))
const db = mongoose.connection;
db.once('open', () => {
    const msgCollection = db.collection('messages')
    const userCollection = db.collection('users')
    const watchStream = msgCollection.watch()
    const watchStreamUser = userCollection.watch()
    watchStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const newMessage = change.fullDocument
            pusher.trigger('message', 'inserted',
                {
                    _id: newMessage._id,
                    sender: newMessage.sender,
                    msg: newMessage.msg,
                    sentTime: newMessage.sentTime,
                    reciver: newMessage.reciver,
                    _v: newMessage._v
                }
            )
        } else {
            console.log('ERROR ACCURIED IN PUSHER')
        }
    })
})

// API routes
app.use('/api/', telegramma)

app.use((err, req, res, next) => {
    res.status(err.status).send("Something went wrong...")
})



app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})