import { useState, useEffect, useLayoutEffect } from 'react'

export function useFetch(url) {
  const [state, setState] = useState('idle')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
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
        setState('rejected')
        setError(err)
      }
    }

    fetchData()

    return () => didCancel = true
  }, [url])

  return [ state, response, error ]
}

export const useResize = () => {
  const [dimensions, setDimensions] = useState([window.innerHeight, window.innerWidth])

  // subscribe to resize events to trigger this state change
  useEffect(() => {
    const onWindowResize = () => {
      setDimensions([window.innerHeight, window.innerWidth])
    };
    window.addEventListener('resize', onWindowResize)

    return () => window.removeEventListener('resize', onWindowResize)
  }, [])

  return dimensions
}

export const useAutoHeight = ({ element, dimensions, layout }) => {
  const { clipToWindow, fixedHeight = containerHeight } = layout
  const [windowHeight] = dimensions
  const [containerHeight, setContainerHeight] = useState(fixedHeight || 0)

  // subscribe to layout, windowHeight changes, length
  // to update the parent virtual-container height
  useLayoutEffect(() => {
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

