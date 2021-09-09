import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { ChatContext } from '../context/UserContext'

function PrivateTelegramRoute({ component: Component, ...rest }) {
    const { currentUser } = useContext(ChatContext)
    return (
        <Route {...rest} render={(props) => { return !currentUser ? <Redirect to='/login' /> : <Component {...props} /> }}></Route>
    )
}

export default PrivateTelegramRoute
