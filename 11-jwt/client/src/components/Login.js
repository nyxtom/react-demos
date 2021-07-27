import React from 'react'

import { useAuth } from '/contexts/auth-context'

export const Login = () => {
  const [auth,setAuth] = useAuth()
  const [username, setUsername] = React.useState()
  const [password, setPassword] = React.useState()

  const onSubmit = (e) => {
    e.preventDefault()
    fetch('/auth/signin', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })
      .then(res => {
        if (res.ok) {
          setAuth({ type: 'auth.signin', user: { username }})
        }
      }, err => {
        console.error(err)
      })
    setAuth({ type: 'auth.signin', user: { username }})
    return false
  }

  return (
    <div className="center">
      <div className="login">
        <form className="login-form" onSubmit={onSubmit}>
          <div className="card-input">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="card-input">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="card-input">
            <button>Sign in</button>
          </div>
        </form>
      </div>
    </div>
  )
}

