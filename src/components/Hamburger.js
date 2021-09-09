import React, { useContext, useState } from 'react'
import '../css/Hamburger.css'
import Switch from "react-switch";
import { ThemeContext } from '../context/ThemeContext'
import { ChatContext } from '../context/UserContext'
import axios from 'axios';
import { useHistory } from "react-router-dom"

function Hamburger({ toggleHam, currentUser, setToggleHam, contactsToggle, setContactsToggle }) {
    const { checked, handleChange } = useContext(ThemeContext)
    const { setting, setSetting } = useContext(ChatContext)
    const history = useHistory()
    const handleLogout = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "https://webtelegramma.herokuapp.com/api/logout"
        })
            .then(() => history.go('/'))
            .catch(e => console.log(e.message))
    }
    return (
        <div className='ham-container' id={toggleHam ? 'toggleOn' : ""} >
            <div className="ham-content">
                <div>
                    <div className="ham-user-info">
                        <div className="ham-user-image">
                            <img src={currentUser.image} />
                        </div>
                        <h1 className="ham-user-name">{currentUser.name}</h1>
                        <h1 className="ham-user-email">@{currentUser.username}</h1>
                    </div>
                    <div className="ham-links">
                        <button onClick={() => setContactsToggle(!contactsToggle) || setToggleHam(false) || setSetting(false)} className="ham-link" href="#"><i className="fas ham-icon fa-address-book"></i> Contacts</button>
                        <button onClick={() => setSetting(!setting) || setToggleHam(false) || contactsToggle && setContactsToggle(false)} className="ham-link" href="#"><i className="fas ham-icon fa-cog"></i> Settings</button>
                        <button onClick={handleLogout} className="ham-link" href="#"><i className="fas ham-icon fa-sign-out-alt"></i> Log Out</button>
                        <label className="ham-link">
                            <span><i className="far ham-icon fa-moon"></i> Night Mode</span>
                            <Switch
                                onChange={handleChange}
                                checked={checked}
                                className='react-switch'
                                uncheckedIcon={false}
                                checkedIcon={false}
                                height={17}
                                width={35}
                                onColor='#41A1D9'
                            />
                        </label>
                    </div>
                </div>
                <div className="ham-version-info">
                    <p>Web EChat, v_0.0.1<br /> by Umar Nazarov</p>
                </div>
            </div>
        </div>
    )
}

export default Hamburger
