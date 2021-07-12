import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

const LoginForm = () => {

  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(username, password)
  }

  return (
    <form className="login" onSubmit={onSubmit}>
      <div className="field">
        <label for="username">Username</label>
        <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="field">
        <label for="password">Password</label>
        <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button>Submit</button>
    </form>
  )
}

const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello World!</h1>
    </div>
    <div className="container">
      <LoginForm />
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
