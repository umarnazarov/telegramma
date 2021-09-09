import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

export const ChatContext = createContext()

function ChatProvider(props) {
    const [activeChat, setActiveChat] = useState(null)
    const [currentUser, setCurrentUser] = useState()
    const [toggleHam, setToggleHam] = useState(false)
    const [toggleUserModal, setToggleUserModal] = useState({ isOpen: false, user: '' })
    const [setting, setSetting] = useState(false)
    const [contactsToggle, setContactsToggle] = useState(false)
    // const [loadImage, setLoadImage] = useState(false)
    const [checked = currentUser && currentUser.online, setChecked] = useState();

    const handleChange = () => {
        setChecked(!checked)
    };

    useEffect(() => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: 'https://webtelegramma.herokuapp.com/api/user'
        })
            .then(res => {
                setCurrentUser(res.data)
                // setChecked(res.data.online)
            })
            .catch((e) => {
                store.addNotification({
                    title: "ERROR",
                    message: e.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    dismiss: {
                        duration: 4000,
                    }
                })
            })
    }, [activeChat])


    useEffect(() => {
        if (currentUser !== undefined && currentUser._id) {
            axios({
                method: 'POST',
                withCredentials: true,
                url: `https://webtelegramma.herokuapp.com/api/user/${currentUser._id}/status/${checked}`
            })
                .then(res => {
                    setChecked(res.data.online)
                    store.addNotification({
                        message: `You are currently: ${checked ? "Online" : "Offline"}`,
                        type: "info",
                        insert: "top",
                        container: "top-right",
                        dismiss: {
                            duration: 4000,
                        }
                    })
                })
                .catch((e) => console.error(e.message))
        }
    }, [checked])

    const data = {
        currentUser,
        setCurrentUser,
        activeChat,
        setActiveChat,
        toggleHam,
        setToggleHam,
        toggleUserModal,
        setToggleUserModal,
        setting,
        setSetting,
        contactsToggle,
        setContactsToggle,
        checked,
        handleChange,
    }
    return (
        <ChatContext.Provider value={data}>
            {props.children}
        </ChatContext.Provider>
    )
}

export default ChatProvider
