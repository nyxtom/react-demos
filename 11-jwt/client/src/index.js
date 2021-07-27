import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import { AuthProvider, useAuth } from '/contexts/auth-context'
import { Login } from '/components/Login'

const Routes = () => {
  const [auth] = useAuth()

  if (!auth.isAuthenticated) {
    return (
      <Login />
    )
  }

  return (<h1>Hello, {auth.user.username}</h1>)
}

const App = () => {
  return (
    <div id="app">
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
