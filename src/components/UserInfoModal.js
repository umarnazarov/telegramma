import React, { useEffect, useState } from 'react'
import "../css/UserInfoModal.css"
import axios from 'axios'
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

function UserInfoModal({ setToggleUserModal, setActiveChat, toggle, activeChat, currentUser }) {
    const [addingContact, setAddingContact] = useState(false)
    const [newChat, setNewChat] = useState({
        members: [currentUser, toggle.user],
        messages: []
    })
    useEffect(() => {
        const findAvailableChat = currentUser && toggle.user && currentUser.chats.filter(c => c.members.find(u => u.username === toggle.user.username))
        console.log(findAvailableChat)
        if (findAvailableChat && findAvailableChat.length === 1) {
            return setNewChat(findAvailableChat[0])
        } else if (findAvailableChat && findAvailableChat.length === 0) {
            return setNewChat({
                members: [currentUser, toggle.user],
                messages: []
            })
        }
    }, [toggle])

    const addNewContact = (user) => {
        setAddingContact(true)
        axios({
            method: "POST",
            url: `https://webtelegramma.herokuapp.com/api/newContact/${currentUser._id}`,
            data: user,
        })
            .then((res) => {
                setAddingContact(false)
                store.addNotification({
                    title: "Added to contacts",
                    message: res.data.message,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    dismiss: {
                        duration: 4000,
                    }
                })
            })
            .catch((e) => {
                // setAddingError(e.response.data.message)
                setAddingContact(false)
                // console.log(addingError)
                store.addNotification({
                    title: "OOPS!",
                    message: e.response.data.message,
                    type: "info",
                    insert: "top",
                    container: "top-right",
                    dismiss: {
                        duration: 3000,
                        onScreen: true
                    }
                })
            })
    }

    if (!toggle.user) {
        return false
    }
    return (
        <div>
            <div className="modal-container" id={toggle.isOpen ? 'modalOn' : ""}>
                <div className="modal-content-top">
                    <h2>User Info</h2>
                    <i onClick={() => setToggleUserModal({ isOpen: false, user: null })} className="fas user-modal fa-times"></i>
                </div>
                <div className='modal-user-info'>
                    <div className="modal-user-img">
                        <img src={toggle.user.image} />
                    </div>
                    <div className="modal-user-bio">
                        <h1>{toggle.user.name} {toggle.user.isAdmin && <i class="fas fa-check-circle"></i>}</h1>
                        <p>Status: {toggle.user.online ? "online" : 'offline'}</p>
                    </div>
                </div>
                <div className="modal-user-data">
                    <div className="modal-user-part">
                        <i className="fas fa-info-circle"></i>
                        <div>
                            <p className="modal-username">{toggle.user.username}</p>
                            <p className="modal-username-text">Username</p>
                        </div>
                    </div>
                    <div className="modal-btns">
                        <button onClick={() => addNewContact(toggle.user)} className="modal-btn">{addingContact ? "Adding..." : "Add to Contacts"}</button>
                        <button onClick={() => setActiveChat(newChat) || setToggleUserModal({ isOpen: false, user: '' })} className="modal-btn">Send Message</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default UserInfoModal
