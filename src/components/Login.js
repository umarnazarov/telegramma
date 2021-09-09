import React, { useState, useRef } from 'react'
import "../css/Register.css"
import { Link, useHistory } from "react-router-dom"
import axios from 'axios'
import spiner from '../spiner.svg'

function Login() {
    const [user, setUser] = useState({ username: null, password: null })
    const [error, setError] = useState({ message: "", password: false, username: false })
    const [loading, setLoading] = useState(false)
    const userNameRef = useRef()
    const passwordRef = useRef()
    const history = useHistory();

    const handeUser = () => {
        setUser({ username: userNameRef.current.value, password: passwordRef.current.value })
        setError({ password: false, username: false, message: "" })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!user.username && !user.password) return setError({ message: "Fill out fields", password: true, username: true })
        if (!user.username) return setError({ message: "Fill out username field", password: false, username: true })
        if (!user.password) return setError({ message: "Fill out password field", password: true, username: false })
        setLoading(true)
        axios({
            method: 'POST',
            data: user,
            withCredentials: true,
            url: 'https://webtelegramma.herokuapp.com/api/login'
        })
            .then(() => {
                history.go('/')
                setLoading(false)
            })
            .catch(e => {
                setError({ message: e.response.data.message })
                setLoading(false)
            })

    }

    return (
        <div className="register-conteiner">
            <i className="fas fa-paper-plane"></i>
            <form onSubmit={(e) => handleSubmit(e)} className="register-form">
                <h1 className="register-main-text">Telegramma</h1>
                <p className="register-inf-text">Please enter your username and password to log in</p>
                <div className="register-content">
                    <label className="register-label" htmlFor="username">Username</label>
                    <input id={error.username ? "usernameERR" : ''} required className="register-input" ref={userNameRef} onChange={handeUser} type="text" name="username" required />
                    <i className={error.username ? "fas x-reg fa-times-circle" : user.username ? "fas d-reg fa-check" : ''}></i>
                </div>
                <div className="register-content">
                    <label className="register-label" htmlFor="password">Password</label>
                    <input id={error.password || user.password && user.password.length <= 5 ? "passwordERR" : ''} required className="register-input" ref={passwordRef} onChange={handeUser} name="password" type="password" required />
                    <i className={error.password || user.password && user.password.length <= 5 ? "fas x-reg fa-times-circle" : user.password && user.password.length >= 5 ? "fas d-reg fa-check" : ''}></i>
                </div>
                <p id="err-msg">{error.message}</p>
                {loading ? <img id="reg-spin" src={spiner} /> : <button onClick={(e) => handleSubmit(e)} id="register-btn">Log In</button>}
                <p className="red-link">Need an Account ? <Link className="red-link-tag" to="/register">Sign Up</Link></p>
            </form>
        </div >
    )
}

export default Login
