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

## Add data fetching

Since we will also want support for data fetching, let's implement a simple utility to look up a fetch request.

```javascript
const FetchContext = React.createContext({})
const FetchCache = ({ children, data = new Map() }) => (
  <FetchContext.Provider value={data}>
    {children}
  </FetchContext.Provider>
)
const useFetchCache = () => React.useContext(FetchContext)

const useFetch = (url) => {
  const cache = useFetchCache()

  const [data, setData] = React.useState(cache[url] || [])
  const [err, setErr] = React.useState(null)
  const [load, setLoad] = React.useState(!fetched)

  React.useEffect(() => {
    if (cache[url]) return

    let didCancel = false
    setLoad(true)
    async function fetchData() {
      try {
        let res = await fetch(url)
        let json = await res.json()
        if (!didCancel) {
          setData(json)
          setLoad(false)
        }
      } catch (err) {
        if (!didCancel) {
          setErr(err)
          setLoad(false)
        }
      }
    }
    fetchData()
    return () => didCancel = true
  }, [url, cache])

  return [data, err, load]
}
```

In the above case the `useFetch` function will take a look at the existing `cache` before executing against the `fetch` function. This of course can be customized in any number of ways (such as accounting for timeouts..etc).

## Create a data list

Now we can create a simple data list that will render out the items from the `/posts` endpoint.

```javascript
const DataList = () => {
  const [data, err, load] = useFetch('/posts')

  return (
    <>
    { err ? <div className="error">{err.message}</div> : null }
    { load ? <div className="message">Loading...</div> : null }
    <ul>
      {data.map(d => (
        <li key={d.id}>
          <h3>{d.title}</h3>
          <pre>{d.body}</pre>
        </li>
      ))}
    </ul>
    </>
  )
}
```

Great! Now the data list will be rendered out with the `/posts` endpoint via `useFetch`. Now all that is left is to setup the `App` component to include the `FetchCache`.

## FetchCache in App

```javascript
const App = ({ cache }) => {
  return (
    <div id="app">
      <FetchCache data={cache}>
        <DataList />
      </FetchCache>
    </div>
  )
}
```

## Update index to load window.__INITIAL_STATE

Server side rendering will render the initial HTML, but the react bundled `main.js` is still going to attempt to hydrate with `<App />`. We need to update this to look at the `window.__INITIAL_STATE` to generate the correct diff so when react loads and runs render it will produce the same output (and ultimately skip fetching `/posts`).

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

ReactDOM.hydrate(<App cache={window.__INITIAL_STATE} />, document.getElementById('root'))
```

That's it! Assuming you followed the rest of the `server/README.md` then we will now see different `/posts` results based on whether it is rendered client side or server side.
