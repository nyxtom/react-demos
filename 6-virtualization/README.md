# effect

Basic implemenation of react app using useEffect to handle data fetching and binding to ui

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Setup initial app

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello World!</h1>
    </div>
    <div className="container">
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
```

## Add a simple implementation of useFetch

```javascript
function useFetch(url) {
  const [state, setState] = React.useState('idle')
  const [response, setResponse] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    let didCancel = false

    setState('pending')
    setError(null)
    async function fetchData() {
      try {
        let response = await fetch(url)
        let json = await response.json()

        if (!didCancel) {
          setState('resolved')
          setResponse(json)
        }
      } catch (err) {
        if (!didCancel) {
          setState('rejected')
          setError(err)
        }
      }
    }

    fetchData()

    return () => didCancel = true
  }, [])

  return [ state, response, error ]
}
```

Now we can fetch any resource url, handle the cancel function so we don't accidently set the state after the component has unmounted, and we also set state/error/responses. We are calling setResponse/setStatus/setError on multiple calls. When we do this, we might be triggering multiple render callbacks as a result. It might be better to combine this into a reducer type state. This will be left for another exercise.

Add to the implementation by leveraging the `useFetch` function in the app to render out the posts.

```javascript
const Post = ({ title, body, id }) => {
  return (
    <article key={id} className="post">
      <h3>{title}</h3>
      <pre>{body}</pre>
    </article>
  )
}

const PostList = ({ posts = [] }) => {
  if (posts) {
    return posts.map(post => <Post {...post} />)
  } else {
    return []
  }
}

const App = () => {
  const [state, response, error] = useFetch('https://jsonplaceholder.typicode.com/posts')

  return (
    <div id="app" className="center">
      <div className="header">
        <h1>Hello World!</h1>
      </div>
      {
        error ? (
          <div className="error">
            {error.message}
          </div>
        ) : null
      }
      <div className="container">
        { state === 'pending' ? 
            (<div>Loading...</div>) : 
            (<PostList posts={response} />)
        }
      </div>
    </div>
  )
}
```

## Update the styles for the posts

```css
/**
 * Posts
 */
.post {
  background: #fff;
  border-bottom: solid 1px #d9d9d9;
  padding: 4px 8px;
  margin: 8px;
}

.error {
  background: #ffcccc;
  padding: 4px;
}
```

## Run the app

```bash
npm start
```
