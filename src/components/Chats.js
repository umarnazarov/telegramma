import React, { useContext, useEffect } from 'react'
import ChatsHeader from './ChatsHeader'
import { ChatContext } from '../context/UserContext'
import '../css/Chats.css'

function Chats(props) {
    const userData = props.currentUser
    const { activeChat, setActiveChat, toggleUserModal, setToggleUserModal, toggleHam, setToggleHam } = useContext(ChatContext)

    return (
        <div onClick={() => toggleUserModal && setToggleUserModal(false)} className="chats-container">
            <ChatsHeader />
            <div onClick={() => toggleHam && setToggleHam(false)} className="chats-content">
                {userData && userData.chats.length === 0 && <div className="no-chat-in-chat"><h1 className="no-chat-text">You have no chats</h1></div>}
                {
                    userData.chats.map(chat => (
                        <div key={chat._id} onClick={() => setActiveChat(chat)} className={`chat-info ${activeChat && activeChat._id === chat._id && "active-chat-thumb"} `}>
                            <div className="chat-image">
                                <img alt="user-img" src={chat.members.find(m => m._id !== userData._id).image} />
                            </div>
                            <div className="chat-text-info">
                                <div className="chat-text-left">
                                    <h3 className="chat-text-main">{chat.members.map(m => m._id !== userData._id && m.name)} {chat.members.find(m => m._id !== userData._id).isAdmin && <i className="fas fa-check-circle"></i>}</h3>
                                    <p className="chat-text-msg">{chat.messages[chat.messages.length - 1].msg}</p>
                                </div>
                                <div className="chat-text-right">
                                    <p className="chat-time">{chat.messages[chat.messages.length - 1].sentTime}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Chats
