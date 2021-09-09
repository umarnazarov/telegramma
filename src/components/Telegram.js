import React, { useContext } from 'react'
import Chats from "./Chats";
import ActiveChat from './ActiveChat'
import { ChatContext } from '../context/UserContext'
import ReactNotification from 'react-notifications-component'
import UserInfoModal from './UserInfoModal'
import "../css/Telegram.css"
import SettingsModal from './SettingsModal'
import ContactsModel from './ContactsModel';

function Telegram() {
    const { currentUser, setCurrentUser, activeChat, setActiveChat, setting, setSetting, setToggleUserModal, toggleUserModal, contactsToggle, setContactsToggle } = useContext(ChatContext)
    return (
        <main className="main-conteiner">
            <ReactNotification />
            <div className="main-content">
                <SettingsModal data={{ setCurrentUser, setting, setSetting, currentUser }} />
                <ContactsModel setToggleUserModal={setToggleUserModal} currentUser={currentUser} contactsToggle={contactsToggle} setContactsToggle={setContactsToggle} />
                <UserInfoModal setActiveChat={setActiveChat} currentUser={currentUser} activeChat={activeChat} setToggleUserModal={setToggleUserModal} toggle={toggleUserModal} />
                <Chats currentUser={currentUser} />
                <ActiveChat activeChat={activeChat} />
            </div>
        </main>
    )
}

export default Telegram
