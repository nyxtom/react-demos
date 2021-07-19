# portals

Simple react application demonstrating portals such as tooltips

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

## Add a bit of css for navigation

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
  padding: 4px 10px;
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
  padding: 1em;
  overflow: hidden;
}


/**
 * Tooltip container
 */
.tooltips {
  position: absolute;
  z-index: 999;
}
.tooltip {
  z-index: 999;
  position: absolute;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 4px -2px #333;
  padding: 1rem;
  background: #fff;
}
```

## Setup a tooltip container

In order to display tooltips at the top level of the container, create a special tooltip element.

```javascript
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
```

The `Tooltip` will rely upon the parent element `ref` to target when hovering. A tooltip will need to handle when the mouse enters and leaves the target component. Let's create the `useHover` hook to handle this behavior.

## Hover Behavior Hook

```javascript
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
```

## Window Resize Hook

In addition, we will need a `useWindowResize` to also update whenever we are hovering in case layout positioning happens to change.

```javascript
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
```

It's also possible to use a `ResizeObserver` but we will ignore that for the time being. We will also need the actual coordinates of the target element in order to position the tooltip.

## Coordinates Bounding Box Hook / Tooltip Positioning

```javascript
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
```

Great, now we have the coordinates setup to update whenever the window resizes, the target changes, the margin, and the layout position changes - as well as whenever the actual container is hovered. We will use this now in a tooltip component.

## ReactDOM.CreatePortal for the Tooltip

```javascript
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
```

The ReactDOM.createPortal will generate a tooltip element with the absolute coordinates provided (assuming the target element is hovered). createPortal will make sure to attach the given child element into the target DOM node provided by the selector. In this case we are using the root `tooltips` element.

## Run the app

```bash
npm start
```
