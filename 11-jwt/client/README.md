# jwt

Simple react application demonstrating integrating JWT tokens and authenticating through a react router login.

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Setup basic app structure

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

const App = () => (
  <div id="app">
    <div className="center">
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

## Setup a bit of css

```css
html, body {
  margin: 0px;
  padding: 0px;
  background: #fcfcfc;
  font-size: 12px;
}
```

## Create a simple login form component

```javascript
const Login = () => {
  const [username, setUsername] = React.useState()
  const [password, setPassword] = React.useState()

  const onSubmit = (e) => {
    e.preventDefault()
    return false
  }

  return (
    <div className="center">
      <div className="login">
        <form className="login-form" bmit={onSubmit}>
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
```

Update the css to layout the login form

```css
/**
 * Flexbox utils
 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/**
 * Login form
 */
.login {
  background: #666;
  margin-top: 20vh;
  padding-left: 1rem;
  border: solid 1px #eee;
}
.login-form {
  box-shadow: 0px 1px 3px -2px #999;
  padding: 3rem 4rem 6rem;
  background: #fff;
}
.login-form h3 {
  margin: 0px;
  padding: 0px;
}
.card-input {
  padding: 1rem;
}
.card-input label {
  display: block;
  padding-bottom: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
  color: #666;
}
.card-input input {
  padding: 0.5rem;
  outline: 0;
  background: #fff;
  border: 1px solid #aaa;
  border-radius: 3px;
}
.card-input button {
  padding: 0.5rem 1rem;
}
```

## Create an AuthProvider

In order to store and retrieve the current user context, we will create a `React.createContext` and `AuthProvider` to store the current user details and retrieve them when the app loads.

```javascript
const authReducer = (state, payload) => {
  if (payload.type === 'auth.signin') {
    return {
      ...state,
      isAuthenticated: true,
      user: payload.user
    }
  } else if (payload.type === 'auth.signout') {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    }
  }
}
const AuthContext = React.createContext({})
const AuthProvider = ({children}) => {
  const [auth, dispatch] = React.useReducer(authReducer, { isAuthenticated: false })
  return (
    <AuthContext.Provider value={[auth, dispatch]}>
      {children}
    </AuthContext.Provider>
  )
}
const useAuth = () => React.useContext(AuthContext)
```

## Update Login Component to update auth details

Now we can update the login component to set the auth details on submit

```javascript
  const [auth,setAuth] = useAuth()
  const [username, setUsername] = React.useState()
  const [password, setPassword] = React.useState()

  const onSubmit = (e) => {
    e.preventDefault()
    setAuth({ type: 'auth.signin', user: { username }})
    return false
  }
```

## Update App to use AuthProvider and Login

Now the `App` will need to make use of the `AuthProvider` and display the correct component based on the authenticated context.

```javascript
const Routes = () => {
  const [auth] = useAuth()

  if (!auth.isAuthenticated) {
    return (
      <Login />
    )
  }

  return (<h1>Hello {auth.user.username}</h1>)
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
```

If you're using the `react-router-dom`, you can make use of the `window.location` and the `history` api to determine which page we should be routing too. Typically in any protected application, we may make use of rbac rules and the current authenticated context to route users to the right place. In this simple implementation we aren't doing any real authentication but we are setting state accordingly.

### Run the app

```bash
npm start
```
