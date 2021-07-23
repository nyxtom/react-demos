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
    height: 40px;
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
  height: calc(100vh - 50px);
  overflow: hidden;
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
  overflow: hidden;
  height: calc(100% - 16px);
}

.error {
  background: #ffcccc;
  padding: 4px;
}
```

## Add a utility to support resizing state

Whenever the window resizes we need to capture the dimensions so we can handle dimensions that may be needed to calculate a proper virtualized component.

```javascript
const useResize = () => {
  const [dimensions, setDimensions] = React.useState([window.innerHeight, window.innerWidth])

  // subscribe to resize events to trigger this state change
  React.useEffect(() => {
    const onWindowResize = () => {
      setDimensions([window.innerHeight, window.innerWidth])
    };
    window.addEventListener('resize', onWindowResize)

    return () => window.removeEventListener('resize', onWindowResize)
  }, [])

  return dimensions
}
```

## Add a utility to handle calculating the height of a container

```javascript
const useAutoHeight = ({ element, dimensions, layout }) => {
  const { clipToWindow, fixedHeight = containerHeight } = layout
  const [windowHeight] = dimensions
  const [containerHeight, setContainerHeight] = React.useState(fixedHeight || 0)

  // subscribe to layout, windowHeight changes, length
  // to update the parent virtual-container height
  React.useLayoutEffect(() => {
    if (fixedHeight) {
      return
    }

    let height
    if (clipToWindow) {
      height = windowHeight - element.current.offsetTop
    } else {
      let rect = element.current.parentElement.getBoundingClientRect()
      height = rect.height
    }
    if (containerHeight !== height) {
      setContainerHeight(height)
    }
  }, [fixedHeight, windowHeight, element, clipToWindow])

  return containerHeight
}
```

This will look at the window height and the offset top for the container to calculate the container height, otherwise it will use the parent element's boudnign client rectangle and use that height. This should work fine in scenarios such as `100vh` or even flexbox containers.

## Implement a VirtualList

Now that we have several utilities to handle the container size and the window dimensions, we need a component that will render a container to a fixed height and an inner container to the hypothetical height based on the number of items and the fixed per item height.

```javascript
const VirtualList = ({ length, layout, render }) => {
  const element = React.useRef()
  const dimensions = useResize()
  const containerHeight = useAutoHeight({
    element,
    dimensions,
    layout
  })

  const [params, setParams] = React.useState([])
  const [scrollTop, setScrollTop] = React.useState(0)

  const innerHeight = React.useCallback(() => {
    return layout.height * length
  }, [layout, length])()

  // subscribe to container height, length, scrollTop, layout
  // to update the current start and end index
  React.useLayoutEffect(() => {
    const pageSize = Math.floor((2 * containerHeight) / layout.height)

    const startIndex = Math.min(
      length - 1,
      Math.max(0, Math.floor(scrollTop / layout.height) - pageSize)
    )
    const endIndex = Math.min(
      length - 1,
      startIndex + pageSize * 2
    )

    const itemWidth = layout.width || '100%'
    const itemHeight = layout.height
    setParams({
      startIndex,
      endIndex,
      itemHeight,
      itemWidth
    })
  }, [length, layout, scrollTop, containerHeight]);

  // update scroll top whenever this is called
  const onScroll = React.useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop)
  })

  return (
    <div className="virtual-container" ref={element} style={{ overflow: 'auto', height: containerHeight }} onScroll={onScroll}>
      <div style={{ position: 'relative', height: innerHeight }}>
        {typeof render === 'function' ? render(params) : null}
      </div>
    </div>
  )
}
```

## Replace implementation of PostList to use VirtualList

```javascript
const PostList = ({ posts = [] }) => {
  const onRender = ({ startIndex, endIndex, itemHeight, itemWidth }) => {
    if (startIndex !== null && endIndex != null) {
      return posts.slice(startIndex, endIndex + 1).map((post, i) => (
        <Post key={post.id} {...post} style={{ 
          position: 'absolute',
          top: ((startIndex + i) * itemHeight),
          height: itemHeight, width: itemWidth  
        }} />
      ))
    }
  }

  if (posts) {
    return <VirtualList length={posts.length} layout={{ height: 232 }} render={onRender} />
  }

  return null
}

const Post = ({ title, body, id, style }) => {
  return (
    <div style={style} className="post-container">
      <article key={id} className="post">
        <h3>{id} {title}</h3>
        <pre>{body}</pre>
      </article>
    </div>
  )
}
```

## Run the app

```bash
npm start
```
