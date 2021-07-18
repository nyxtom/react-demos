import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

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
