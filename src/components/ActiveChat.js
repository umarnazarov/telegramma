import React, { useState, useContext, useEffect } from 'react'
import { ChatContext } from '../context/UserContext'
import "../css/ActiveChat.css"
import Pusher from 'pusher-js'
import axios from 'axios'
import ReactScroll from 'react-scrollable-feed'
import spiner from '../spiner.svg'
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Emojies from './Emojies'

function ActiveChat() {
    const { currentUser, setCurrentUser, activeChat, setActiveChat, toggleUserModal, setToggleUserModal, toggleHam, setToggleHam } = useContext(ChatContext)
    const reciver = activeChat && activeChat.members.find(m => m._id !== currentUser._id)._id
    const [newMSG, setNewMSG] = useState({ reciver: reciver, sender: currentUser._id, msg: '', sentTime: new Date().toLocaleTimeString() })
    const [sendingMSG, setSendingMSG] = useState(false)
    const [emojies, setEmojies] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(null);

    useEffect(() => {
        const pusher = new Pusher('6b4bc3647f287c21f650', {
            cluster: 'ap2'
        });
        const channel = pusher.subscribe('message');
        channel.bind('inserted', async data => {
            console.log("in here")
            setActiveChat((s) => {
                const validMem1 = s && s.members.some(m => m._id === data.sender)
                if (validMem1) {
                    return {
                        ...s,
                        messages: [...s.messages, data]
                    }
                } else if (!s) {
                    return null
                }
                else if (s) {
                    return s
                }
            })
            axios({
                method: 'GET',
                withCredentials: true,
                url: 'https://webtelegramma.herokuapp.com/api/user'
            })
                .then(res => setCurrentUser(res.data))
                .catch(() => setCurrentUser(null))
        });
    }, [])


    useEffect(() => {
        setNewMSG(e => ({
            ...e,
            msg: e.msg + (chosenEmoji ? chosenEmoji.emoji : '')
        }))
    }, [chosenEmoji])

    useEffect(() => {
        setNewMSG({ ...newMSG, msg: '' })
        setEmojies(false)
    }, [activeChat])

    const addNewMsg = (e) => {
        e.preventDefault()
        if (!newMSG.msg) {
            store.addNotification({
                title: "OOPS!",
                message: "Nothing to send, please fill input",
                type: "danger",
                insert: "top",
                container: "top-right",
                dismiss: {
                    duration: 4000,
                }
            })
        } else {
            setSendingMSG(true)
            const senter = activeChat.members.find(m => m._id !== currentUser._id)._id
            axios({
                method: "POST",
                url: `https://webtelegramma.herokuapp.com/api/sender/${currentUser._id}/reciver/${senter}/newMsg/${activeChat._id}`,
                // data: { ...newMSG, sentTime: new Date().toLocaleTimeString(), reciver: activeChat.members.find(m => m._id !== currentUser._id)._id },
                data: { newmsg: { ...newMSG, sentTime: new Date().toLocaleTimeString(), reciver: activeChat.members.find(m => m._id !== currentUser._id)._id }, activechat: { ...activeChat, members: [currentUser._id, senter] } },
            })
                .then((res) => {
                    if (res.data.chat) {
                        setActiveChat(res.data.chat)
                    }
                    setSendingMSG(false)
                })
                .catch(err => {
                    console.log(err.response.data.error)
                    setSendingMSG(false)
                    store.addNotification({
                        title: "Error",
                        message: err.response.data.message,
                        type: "danger",
                        insert: "top",
                        container: "top-right",
                        dismiss: {
                            duration: 4000,
                        }
                    })
                    setSendingMSG(false)
                })
        }
    }

    if (!activeChat) {
        return <div onClick={() => toggleHam && setToggleHam(false)} className="no-chat"><h1 className="no-chat-text">Select a chat to start messaging</h1></div>
    }
    return (
        <div onClick={() => toggleHam && setToggleHam(false)} className="active-user-conteiner">
            <div className="active-chat-header">
                <div onClick={() => setToggleUserModal(e => e.isOpen ? { isOpen: false, user: null } : { isOpen: true, user: activeChat.members.find(m => m._id !== currentUser._id) })} className="active-user-info">
                    <h2 id='active-user-name'>{activeChat.members.map(m => m._id !== currentUser._id && m.name)}</h2>
                    <p className="active-user-activity">Status: {activeChat.members.find(m => m._id !== currentUser._id).online ? "online" : 'offline'}</p>
                </div>
                <div className="active-user-chat-options">
                    {/* <i className="fas fa-ellipsis-v"></i> */}
                </div>
            </div>
            <ReactScroll>
                <div onClick={() => toggleUserModal && setToggleUserModal(false)} className="active-user-chat">
                    {activeChat.messages.map(m =>
                        m.sender === currentUser._id ?
                            <div key={m._id} className="active-you-chat">
                                <p className="msg-time">{m.sentTime}</p>
                                <p className="active-you-chat-text">{m.msg}</p>
                            </div> :
                            <div key={m._id} className="active-person-chat">
                                <p className="msg-time">{m.sentTime}</p>
                                <p className="active-person-chat-text">{m.msg}</p>
                            </div>
                    )}
                </div>
            </ReactScroll>
            <form onSubmit={(e) => addNewMsg(e)} className="active-chat-form">
                <input value={newMSG.msg} onChange={e => setNewMSG({ ...newMSG, msg: e.target.value })} className="active-chat-input" type="text" placeholder="Write a message..." />
                {sendingMSG ? <img id="send-spin" src={spiner} /> : ""}
                <div className="form-icons">
                    <i onClick={() => setEmojies(!emojies)} className="fas form-icon fa-smile-beam"></i>
                    <i onClick={(e) => addNewMsg(e)} className="fas form-icon fa-paper-plane"></i>
                </div>
                {emojies && <Emojies chosenEmoji={chosenEmoji} setChosenEmoji={setChosenEmoji} />}
            </form>
        </div >
    )
}

export default ActiveChat
