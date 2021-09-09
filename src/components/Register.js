import React, { useState, useRef } from 'react'
import "../css/Register.css"
import { Link } from "react-router-dom"
import { useHistory } from "react-router"
import spiner from '../spiner.svg'
import axios from 'axios'

function Register() {
    const [user, setUser] = useState({ name: null, username: null, password: null })
    const [error, setError] = useState({ message: "", name: false, password: false, username: false })
    const [loading, setLoading] = useState(false)

    const nameRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const history = useHistory();

    const handeUser = () => {
        setUser({ username: usernameRef.current.value, password: passwordRef.current.value, name: nameRef.current.value })
        setError({ name: false, password: false, username: false, message: "" })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        if (!user.name && !user.password && !user.username) return setError({ message: "Fill out fields", name: true, password: true, username: true })
        if (!user.name) return setError({ message: "Fill out name field", password: false, username: false, name: true })
        if (!user.password) return setError({ message: "Fill out password field", password: true, username: false, name: false })
        if (!user.username) return setError({ message: "Fill out username field", password: false, username: true, name: false })
        setLoading(true)
        axios({
            method: 'POST',
            data: user,
            withCredentials: true,
            url: 'https://webtelegramma.herokuapp.com/api/register'
        })
            .then(() => {
                history.go('/')
                setLoading(false)
            })
            .catch(e => {
                const err = e && e.response.data
                if (err.errors[0].param === "username") {
                    setError({ message: err.errors[0].msg, username: true, password: false, name: false })
                } else if (err.errors[0].param === "password") {
                    setError({ message: err.errors[0].msg, password: true, username: false, name: false })
                } else {
                    setError({ message: err.message })
                }
                setLoading(false)
            })

    }

    return (
        <div className="register-conteiner">
            <i className="fas fa-paper-plane"></i>
            <form onSubmit={handleSubmit} className="register-form">
                <h1 className="register-main-text">Telegramma</h1>
                <p className="register-inf-text">Create your account. It's free and only takes a minute</p>
                <div className="register-content">
                    <label className="register-label" htmlFor="name">Your Name</label>
                    <input id={error.name ? "nameERR" : ''} onChange={handeUser} ref={nameRef} className="register-input" type="text" name="name" required />
                    <i className={error.name ? "fas x-reg fa-times-circle" : user.name ? "fas d-reg fa-check" : ''}></i>
                </div>
                <div className="register-content">
                    <label className="register-label" htmlFor="password">Password</label>
                    <input id={error.password || user.password && user.password.length <= 5 ? "passwordERR" : ''} className="register-input" name="password" onChange={handeUser} ref={passwordRef} type="password" required />
                    <i className={error.password || user.password && user.password.length <= 5 ? "fas x-reg fa-times-circle" : user.password && user.password.length >= 5 ? "fas d-reg fa-check" : ''}></i>
                </div>
                <div className="register-content">
                    <label className="register-label" htmlFor="username">Username</label>
                    <input id={error.username ? "usernameERR" : ''} onChange={handeUser} ref={usernameRef} className="register-input" type="text" name="username" required />
                    <i className={error.username ? "fas x-reg fa-times-circle" : user.username ? "fas d-reg fa-check" : ''}></i>
                </div>
                <p id="err-msg">{error.message}</p>
                {loading ? <img id="reg-spin" src={spiner} /> : <button onClick={(e) => handleSubmit(e)} id="register-btn">Register</button>}
                <p className="red-link">Already a member ? <Link className="red-link-tag" to="/login">Sign In</Link></p>
            </form>
        </div>
    )
}

export default Register
