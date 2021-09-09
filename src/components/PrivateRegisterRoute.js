import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { ChatContext } from '../context/UserContext'

function PrivateLoginRoute({ component: Component, ...rest }) {
    const { currentUser } = useContext(ChatContext)
    return (
        <Route {...rest} render={(props) => { return !currentUser ? <Component {...props} /> : <Redirect to='/' /> }}></Route>
    )
}

export default PrivateLoginRoute