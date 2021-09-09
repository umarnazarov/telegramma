import React, { useState, useEffect, } from 'react'
import '../css/ContactsModel.css'
import axios from 'axios'

function ContactsModel({ currentUser, contactsToggle, setContactsToggle, setToggleUserModal }) {
    const [contacts, setContacts] = useState(null)

    useEffect(() => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `https://webtelegramma.herokuapp.com/api/user/${currentUser._id}/contacts`
        })
            .then(res => setContacts(res.data.contacts))
            .catch((e) => alert(e.response.data.message))
    }, [contactsToggle])

    return (
        <div className="contacts-container" id={contactsToggle ? 'ContactsOn' : ""}>
            <div className="contacts-navigation">
                <h1>Contacts</h1>
                <i onClick={() => setContactsToggle(false)} className="fas user-modal fa-times"></i>
            </div>
            {contacts && contacts.length !== 0 ? contacts.map(c => (
                <div onClick={() => setToggleUserModal({ isOpen: true, user: c.contact }) || setContactsToggle(false)} key={c.contact._id} className='u-contact'>
                    <img className="u-contact-img" src={c.contact.image} />
                    <div>
                        <h2 className="u-contact-name">{c.contact.name}</h2>
                        <h2 className="u-contact-username">{c.contact.username}</h2>
                    </div>
                </div>
            )) : <p id="no-contact">You have no contacts</p>}
        </div>
    )
}

export default ContactsModel
