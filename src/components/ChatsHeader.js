import React, { useState, useContext, useEffect, useRef } from 'react'
import "../css/ChatsHeader.css"
import { ChatContext } from '../context/UserContext'
import Hamburger from './Hamburger'
import axios from 'axios'
import useScrollOnDrag from 'react-scroll-ondrag';

function ChatsHeader() {
    const { toggleHam, setToggleHam, currentUser, setToggleUserModal, contactsToggle, setContactsToggle } = useContext(ChatContext)
    const [users, setUsers] = useState(null)
    const [foundUsers, setFoundUsers] = useState(null)
    const [input, setInput] = useState(null)
    const ref = useRef();
    const { events } = useScrollOnDrag(ref);

    useEffect(() => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: 'https://webtelegramma.herokuapp.com/api/users'
        })
            .then(res => setUsers(res.data))
            .catch(() => setUsers(null))
    }, [input])

    const handleSearch = (e) => {
        if (!e.target.value) {
            setInput(null)
            setFoundUsers(null)
        } else {
            e.preventDefault()
            setInput(e.target.value)
            const filteredUsers = users.filter(u => u.username.includes(e.target.value) || u.name.includes(e.target.value)).filter(m => m.username !== currentUser.username)
            if (filteredUsers === []) {
                setFoundUsers(null)
            } else {
                setFoundUsers(filteredUsers)
            }
        }
    }
    return (
        <div id="chats-content-head">
            <div className="chats-header-conteiner">
                <div className="chats-header-content">
                    <i onClick={() => setToggleHam(!toggleHam)} className="fas fa-bars"></i>
                    <Hamburger contactsToggle={contactsToggle} setContactsToggle={setContactsToggle} toggleHam={toggleHam} setToggleHam={setToggleHam} currentUser={currentUser} />
                    <form className="search-form">
                        <input className="search-chat" type="text" placeholder="Seacrh" onChange={(e) => handleSearch(e)} />
                    </form>
                </div>
            </div>
            <div ref={ref} {...events} className="founded-users">
                {input !== null && foundUsers.length === 0 && <p id="notFound">No users were found</p>}
                {foundUsers && foundUsers.map(u => (
                    <div key={u._id} onClick={() => setToggleUserModal(s => !s.isOpen ? { isOpen: true, user: u } : { isOpen: false, user: '' })} className="found-user">
                        <div>
                            <img className="found-image" src={u.image} />
                        </div>
                        <div>
                            <div id="user-cred">
                                <p className="found-name">{u.name}</p>
                                {u.isAdmin && <i className="fas fa-check-circle"></i>}
                            </div>
                            <p className="found-username">@{u.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatsHeader
