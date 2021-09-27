const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require("../../models/UserModel");
const Chat = require("../../models/ChatSchema");
const Contact = require("../../models/ContactSchema");
const Message = require("../../models/MessageSchema");
const passport = require('passport');
const { body, check, validationResult } = require('express-validator');
const defaultMsg = require("../../defaultMsg")

router.post("/login",
    [
        check('password', "Password cannot be blank").notEmpty(),
        check('username', "Usename cannot be blank").notEmpty()
    ],
    (req, res, next) => {
        try {
            passport.authenticate("local", (err, user, info) => {
                if (err) throw res.status(400).send({ message: "Something went wrong... Please try again." });
                if (!user) res.status(404).send({ message: "Icorrect password or user doesn't exists" });
                else {
                    req.logIn(user, (err) => {
                        if (err) res.status(400).send({ message: "An Error accuried while logging you in" });
                        res.status(200).send({ message: "Successfully Loged" })
                    })
                }
            })(req, res, next)
        } catch (e) {
            res.status(400).send({ message: "Something went wrong... Please try again." });
        }
    })

router.post(
    '/register',
    [
        check('password', "Password must be at least 6 characters")
            .isLength({ min: 6 }),
        body('username', "Username cannot be less than 6 or more than 16 characters")
            .isLength({ min: 6, max: 16 })
            .notEmpty()
            .custom(value => {
                return User.findOne({ username: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject('Username already taken')
                        }
                    })
            })

    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: "Incorrect data in registration" })
            }
            const { username, password, name, email } = req.body
            const hashedPass = await bcrypt.hash(password, 12)
            const userData = { username, password: hashedPass, name }
            const user = await User.findOne({ username })

            if (!user) {
                const newUser = new User(userData)
                const Admin = await User.findOne({ username: "telegramma" })
                const newMsg = {
                    sender: Admin,
                    msg: defaultMsg
                }
                const newMessage = new Message(newMsg)
                const savedMsg = await newMessage.save()
                const chat = {
                    members: [newUser, Admin],
                    messages: [savedMsg]
                }
                const newChat = new Chat(chat)
                await newChat.save()
                newUser.chats.push(newChat)
                await User.updateOne({ username: "telegramma" }, { $push: { chats: [newChat] } })
                await newUser.save()
                passport.authenticate("local", (err, user, info) => {
                    if (err) throw res.status(400).send({ message: "Something went wrong... Please try again." });
                    if (!user) res.status(404).send({ message: "Icorrect password or the user was not found" });
                    else {
                        req.logIn(user, (err) => {
                            if (err) res.status(400).send({ message: "An Error accuried while logging you in" });
                            res.status(200).send({ message: "Successfully Loged" })
                        })
                    }
                })(req, res, next)
            } else {
                res.status(400).send({ message: "User already exists" })
            }
        } catch (e) {
            console.log(e)
            res.status(409).send({ message: e })
        }
    })

router.get('/user', async (req, res) => {
    const data = req.user && await User.findOne({ _id: req.user.id })
        .populate({
            path: "contacts"
        })
        .populate({
            path: 'chats',
            model: 'Chat',
            populate: [
                {
                    path: 'members',
                    model: 'User',
                },
                {
                    path: 'messages',
                    model: 'Message',
                }
            ],
        })
    res.json(data)
})

router.get('/users', async (req, res) => {
    const data = await User.find({})
    res.json(data)
})

router.get('/logout', function (req, res) {
    try {
        req.logout();
        res.status(200).send({ message: "LOGED OUT" })
    } catch (e) {
        res.status(400).send({ message: "ERROR LOGED OUT", error: e.message })
    }
});

router.post('/sender/:iD/reciver/:rID/newMsg/:id', async (req, res) => {
    const { iD, rID, id } = req.params
    const { activechat, newmsg } = req.body
    try {
        if (id === 'undefined') {
            const newMsg = new Message(newmsg)
            await newMsg.save()
            const newChat = await new Chat(activechat)
            newChat.messages.push(newMsg)
            await newChat.save()
            await User.updateOne({ _id: iD }, { $push: { chats: [newChat] } })
            await User.updateOne({ _id: rID }, { $push: { chats: [newChat] } })
            const createdChat = await Chat.findById(newChat._id).populate([
                {
                    path: 'members',
                    model: 'User',
                },
                {
                    path: 'messages',
                    model: 'Message',
                }
            ])
            res.status(200).send({ chat: createdChat })
        } else {
            const newMsg = new Message(newmsg)
            await newMsg.save()
            const chat = await Chat.findOne({ _id: id })
            chat.messages.push(newMsg)
            chat.save()
            res.status(200).send({ message: "Message was sent" })
        }
    } catch (e) {
        res.status(400).send({ message: "Message wasn't sent", error: e.message })
    }
})





router.post('/newContact/:id', async (req, res) => {
    const findUser = await User.findById(req.params.id).populate({ path: "contacts", model: "Contact" })
    const haveIt = await findUser.contacts.filter(c => c.contact == req.body._id)
    if (haveIt.length !== 0) {
        res.status(401).send({ message: "This user is already in your contacts" })
    } else {
        const newContact = new Contact({ contact: req.body })
        await newContact.save()
        findUser.contacts.push(newContact)
        findUser.save()
        res.status(200).send({ message: "User was successfully added to contacts" })
    }
})

router.get("/user/:id/contacts", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate(
                {
                    path: "contacts", model: "Contact",
                    populate: {
                        path: "contact",
                        model: "User"
                    }
                }
            )
        res.status(200).json(user)
    } catch (e) {
        res.status(400).send({ message: e.message })
    }
})

router.post('/user/:id/status/:status', async (req, res) => {
    try {
        await User.updateOne({ _id: req.params.id }, { online: JSON.parse(req.params.status) })
        const status = await User.findById(req.params.id).select('online')
        res.status(200).send(status)
    } catch (e) {
        console.log(e.message)
    }
})

router.post('/user/:id/image', async (req, res) => {
    try {
        await User.updateOne({ _id: req.params.id }, { image: req.body.image })
        res.status(200).send({ message: "Image was updated" })
    } catch (e) {
        res.status(400).send({ message: "Something went wrong. Could not update image" })
    }
})

router.post('/user/:id/name/update', async (req, res) => {
    try {
        await User.updateOne({ _id: req.params.id }, { name: req.body.name })
        res.status(200).send({ message: "Name was updated" })
    } catch (e) {
        res.status(400).send({ message: "Something went wrong. Could not update name" })
    }
})


module.exports = router;