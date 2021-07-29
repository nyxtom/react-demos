# ssr

Simple hello world react application with server side rendering.

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Setup the basic app

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <div id="app">
    <h1>Hello World!</h1>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

## Update to use hydrate

Since we will be performing server side rendering, the app needs to use `hydrate` instead of `render` as the hydrate function will setup react after it has already been rendered by the server.

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <div id="app">
    <h1>Hello World!</h1>
  </div>
)

ReactDOM.hydrate(<App />, document.getElementById('root'))
```

Unfortunately, this will not work well server side if we hope to import the App. So let's put the `App` into another file `App.js`

```javascript
// src/App.js
import React from 'react'

const App = () => (
  <div id="app">
    <h1>Hello World!</h1>
  </div>
)

export default App
```

Then import the app in `index.js` instead.

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

ReactDOM.hydrate(<App />, document.getElementById('root'))
```

## Setup server side rendering in server

Follow the steps in `server/README.md` to setup ssr.
