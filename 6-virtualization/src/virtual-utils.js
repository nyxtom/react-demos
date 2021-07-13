import React from 'react'

export const useResize = () => {
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

export const useContainerHeight = ({ element, dimensions, layout }) => {
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

