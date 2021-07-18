import React from 'react'
import ReactDOM from 'react-dom'

import { useFetch, useResize, useAutoHeight } from './utils'

import './App.css'

/**
* To get virtual lists to work properly, consider what it is doing.
* 1. It is a container that can scroll. 
* 2. The scrollbar is based on the hypothetical height of **all** items
* 3. It has an visible height for what can actually be visible
* 4. Visible items start at a startIndex, end at endIndex
* 5. Start and end indices are based on current scroll position
*/
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

ReactDOM.render(<App />, document.getElementById('root'))
