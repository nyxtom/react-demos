# state

Basic implemenation of react app using useState to handle a simple login form

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Import useState and create a simple component form

```javascript
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
```

## Update the styles a bit for navigation

```css
html, body {
  margin: 0px;
  padding: 0px;
  background: #f9f9f9;
  font-size: 12px;
}

h1 {
  font-size: 2rem;
  margin: 0px;
  padding: 0.5rem;
}

/**
 * Header
 */
.header {
    padding: 4px;
    border-bottom: solid 1px #d9d9d9;
    box-shadow: 0px 1px 6px -2px #aaa;
    width: 100%;
    background: #fff;
    display: flex;
    z-index: 999;
    position: relative;
}

/**
 * Container
 */
.container {
  padding: 1rem;
}

/**
 * Login
 */
.login {
  background: #fff;
  width: 300px;
  padding: 2rem;
}

.login .field {
  margin: 1rem;
}
.login label {
  width: 70px;
  display: inline-block;
  text-align: right;
  margin-right: 0.5rem;
}
.login button {
  display: block;
  margin: 0 auto;
}
```

## Run the app

```bash
npm start
```
