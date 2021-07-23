import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

const useHover = (target) => {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const show = () => setVisible(true)
    const hide = () => setVisible(false)

    target.current.addEventListener('mouseenter', show)
    target.current.addEventListener('mouseleave', hide)

    return () => {
      target.current.removeEventListener('mouseenter', show)
      target.current.removeEventListener('mouseleave', hide)
    }
  }, [])

  return visible
}

const useWindowResize = () => {
  const [windowResize, setWindowResize] = React.useState({})

  React.useEffect(() => {
    const onResize = () => setWindowResize({ width: window.width, height: window.height })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return windowResize
}

const useCoords = ({target, position = 'bottom', margin = 5, hover}) => {
  const windowResize = useWindowResize()
  const [coords, setCoords] = React.useState({})

  React.useEffect(() => {
    const rect = target.current.getBoundingClientRect()

    let center = {
      left: rect.x,
      top: rect.y
    }

    if (position === 'bottom') {
      center.transform = `translate(0%, ${margin + rect.height}px)`
    } else if (position === 'top') {
      center.transform = `translate(0%, calc(-100% - ${margin}px))`
    } else if (position === 'left') {
      center.transform = `translate(calc(-100% - ${margin}px), 0px)`
    } else if (position === 'right') {
      center.transform = `translate(${rect.width + margin}px, 0px)`
    }

    setCoords(center)

  }, [target, position, margin, windowResize, hover])

  return coords
}

const Tooltip = ({ target, position = 'bottom', children, id = 'tooltips' }) => {
  const hover = useHover(target)
  const coords = useCoords({target, position, hover})

  if (!hover) {
    return null
  }
  
  return ReactDOM.createPortal(
    <div className="tooltip" style={{ ...coords }}>
      {children}
    </div>,
    document.getElementById(id)
  )
}

const App = () => {
  const buttonRef = React.useRef()

  return (
    <div id="app" className="center">
      <div className="header">
        <h1>Hello World!</h1>
      </div>
      <div className="container">
        <button ref={buttonRef}>
          Hover Here
        </button>
        <Tooltip target={buttonRef}>
          <h4>Title</h4>
          <pre>This is some content and a test</pre>
        </Tooltip>
      </div>
      <div id="tooltips">
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
