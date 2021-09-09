import { useContext, useState } from "react"
import Login from './components/Login'
import Register from './components/Register'
import Telegram from './components/Telegram'
import { Switch } from 'react-router-dom'
import ChatProvider from './context/UserContext'
import PrivateTelegramRoute from './components/PrivateTelegramRoute'
import PrivateLoginRoute from './components/PrivateLoginRoute'
import PrivateRegisterRoute from './components/PrivateRegisterRoute'
import { ThemeProvider } from "styled-components"
import { GlobalStyles } from './Theme/Global';
import { darkTheme } from './Theme/Theme'
import { lightTheme } from './Theme/Theme'
import { ThemeContext } from './context/ThemeContext'

function App() {
  const { checked } = useContext(ThemeContext)
  return (
    <ChatProvider>
      <ThemeProvider theme={checked ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Switch>
          <PrivateTelegramRoute onLeave={() => alert("leaving")} path="/" exact component={Telegram} />
          <PrivateRegisterRoute path="/register" exact component={Register} />
          <PrivateLoginRoute path="/login" exact component={Login} />
        </Switch>
      </ThemeProvider>
    </ChatProvider>
  );
}

export default App;
