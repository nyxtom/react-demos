# lazy image

Simple react application demonstrating a lazy loaded image component

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Setup basic app structure

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

## Create a component to handle images

```javascript
const LazyImage = ({ src }) => {
  const imageRef = React.useRef();
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useLayoutEffect(() => {
    let didCancel = false

    setLoading(true)
    setError(null)
    imageRef.current.src = src
    imageRef.current.onload = () => {
      if (!didCancel) {
        setLoading(false)
      }
    }
    imageRef.current.onerror = (e) => {
      if (!didCancel) {
        setError(e.message)
      }
    }

    return () => didCancel = true
  }, [src])

  return (
    <div className="lazy-image">
      {error !== null ? <span style={{color: 'red'}}>{error}</span> : null}
      <img style={{ display: loading ? 'none' : null }} ref={imageRef} />
    </div>
  )
}
```

Using the layout effect (meaning the effect will execute at the minimum before the browser paints), this will assign the src to the current image ref before updating the `loading` state and `error` state based on whatever the `onload` or `onerror` returns. We can further demonstrate this **lazy** loading behavior with a timeout.

```javascript
const LazyImage = ({ src }) => {
  const imageRef = React.useRef();
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useLayoutEffect(() => {
    let didCancel = false

    setLoading(true)
    setError(null)
    let t = setTimeout(() => {
      imageRef.current.src = src
      imageRef.current.onload = () => {
        if (!didCancel) {
          setLoading(false)
        }
      }
      imageRef.current.onerror = (e) => {
        if (!didCancel) {
          setError(e.message)
        }
      }
    }, 1000)

    return () => {
      clearTimeout(t)
      didCancel = true
    }
  }, [src])

  return (
    <div className={`lazy-image ${loading ? 'loading' : ''}`}>
      {error !== null ? <span style={{color: 'red'}}>{error}</span> : null}
      <img style={{ display: loading ? 'none' : null }} ref={imageRef} />
    </div>
  )
}
```

## Load the image

```javascript
const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello World!</h1>
    </div>
    <div className="container">
      <LazyImage src="https://via.placeholder.com/640x360" />
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
 * Image
 */
.lazy-image {
  background: #999;
  height: 360px;
  width: 640px;
  opacity: 1;
  transition: opacityk1s ease-in-out;
}
.lazy-image.loading {
  opacity: 0.2;
}
```

## Run the app

```bash
npm start
```
