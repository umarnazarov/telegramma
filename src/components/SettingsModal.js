import React, { useEffect, useState, useContext } from 'react'
import '../css/SettingsModal.css'
import Switch from "react-switch";
import { ChatContext } from '../context/UserContext'
import axios from "axios"
import uuid from "uuid/dist/v4"
import { storage } from "../firebase/configs";
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

function SettingsModal({ data }) {
    const { setCurrentUser, setting, setSetting, currentUser } = data
    const [selectedFile, setSelectedFile] = useState(null);
    const { checked, handleChange } = useContext(ChatContext)
    const [imgLoad, setImgLoad] = useState(false)
    const [nameLoad, setNameLoad] = useState(false)
    const [inputOpen, setInputOpen] = useState(false)
    const [inputVal = currentUser.name, setInputVal] = useState()

    useEffect(() => {
        if (selectedFile && selectedFile.image) {
            return axios({
                method: "POST",
                url: `https://webtelegramma.herokuapp.com/api/user/${currentUser._id}/image`,
                data: selectedFile
            })
                .then(res => {
                    console.log(res)
                    setCurrentUser(e => ({
                        ...e,
                        image: selectedFile.image
                    }))
                    setImgLoad(false)
                    store.addNotification({
                        title: "Updated",
                        message: res.data.message,
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        dismiss: {
                            duration: 4000,
                        }
                    })
                })
                .catch(e => {
                    console.log(e)
                    store.addNotification({
                        title: "Error",
                        message: e.response.data.message,
                        type: "danger",
                        insert: "top",
                        container: "top-right",
                        dismiss: {
                            duration: 4000,
                        }
                    })
                    setImgLoad(false)
                })
        }
    }, [selectedFile])

    const handleFileImage = async (input) => {
        if (input.target.files[0]) {
            setImgLoad(true)
            const imgId = uuid()
            const uploadImage = storage.ref(`userImages/${input.target.files[0].name + imgId}`).put(input.target.files[0]);
            uploadImage.on(
                'state_changed',
                snapshot => { },
                err => {
                    console.log(err)
                },
                () => {
                    storage
                        .ref('userImages')
                        .child(input.target.files[0].name + imgId)
                        .getDownloadURL()
                        .then(url => {
                            setSelectedFile({ image: url })
                        })
                }
            )
        }
    }

    const handleIput = (e) => {
        setInputVal(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!inputVal) {
            return store.addNotification({
                title: "Error",
                message: "Name field cannot be blank",
                type: "danger",
                insert: "top",
                container: "top-right",
                dismiss: {
                    duration: 4000,
                }
            })
        }
        setInputOpen(false)
        setNameLoad(true)
        axios({
            method: "POST",
            url: `https://webtelegramma.herokuapp.com/api/user/${currentUser._id}/name/update`,
            data: { name: inputVal }
        })
            .then(res => {
                console.log(res.data.message)
                setNameLoad(false)
                setCurrentUser(e => ({
                    ...e,
                    name: inputVal
                }))
                store.addNotification({
                    title: "Updated",
                    message: res.data.message,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    dismiss: {
                        duration: 4000,
                    }
                })
            })
            .catch(e => {
                console.log(e.response.data.message)
                setNameLoad(false)
                store.addNotification({
                    title: "Error",
                    message: e.response.data.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    dismiss: {
                        duration: 4000,
                    }
                })
            })
    }

    console.log(selectedFile)
    return (
        <div id={setting ? 'SetModalOn' : ""} className="setting-container">
            <div className="setting-top">
                <h1 className="setting-top-text">Info</h1>
                <i onClick={() => setSetting(!setting)} className="fas user-modal fa-times"></i>
            </div>
            <div className="setting-user-info">
                <img className="setting-user-img" src={currentUser.image} />
                <label className="setting-user-btn">
                    {imgLoad ? 'Updating' : "SET A PROFILE PHOTO"}
                    <input onChange={(e) => handleFileImage(e)} className="invis-inp" type="file" />
                </label>
            </div>
            <div className="setting-user-bio">
                <div className="setting-user-bio-btn">
                    <i className="far set-icon fa-user"></i>
                    <div id="user-name-ch">
                        <div>
                            {inputOpen ? <form onSubmit={(e) => handleSubmit(e)}><input onChange={(e) => handleIput(e)} value={inputVal} type="text" className="name-ch" /></form> : <h1 className='setting-user-m-text'>{currentUser.name}</h1>}
                            <p className='setting-user-s-text'>name</p>
                        </div>
                        {inputOpen ? <i onClick={handleSubmit} className="fas user-modal fa-clipboard-check"></i> : <i onClick={() => setInputOpen(!inputOpen)} className="fas user-modal fa-pen"></i>}
                        {inputOpen ? <i onClick={() => setInputOpen(false)} className="fas user-modal fa-times"></i> : ""}
                    </div>
                </div>
                <div className="setting-user-bio-btn">
                    <i className="fas set-icon fa-at"></i>
                    <div>
                        <h1 className='setting-user-m-text'>{currentUser.username}</h1>
                        <p className='setting-user-s-text'>username</p>
                    </div>
                </div>
                <div className="setting-user-bio-btn">
                    <i className="fas set-icon fa-globe"></i>
                    <div className='status-toggle'>
                        <div>
                            <h1 className='setting-user-m-text'>{checked ? "Online" : "Offline"}</h1>
                            <p className='setting-user-s-text'>Status</p>
                        </div>
                        <Switch
                            onChange={() => handleChange()}
                            checked={checked}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={17}
                            width={35}
                            onColor='#41A1D9'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal
