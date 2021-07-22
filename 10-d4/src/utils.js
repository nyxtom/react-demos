import React from 'react'

export const FetchContext = React.createContext({})
export const FetchCache = ({children}) => {
  const [cache] = React.useState({})
  return (
    <FetchContext.Provider value={cache}>
      {children}
    </FetchContext.Provider>
  )
}

export const useFetchCache = (key, callback) => {
  const cache = React.useContext(FetchContext)
  const [data, setData] = React.useState({ status: 'loading', key })

  React.useEffect(() => {
    let didCancel = false

    setData({ status: 'loading', key })
    async function fetchData() {
      if (!cache[key]) {
        cache[key] = callback()
      }
      try {
        let result = await cache[key]
        if (!didCancel) {
          setData({ status: 'resolved', key, data: result })
        }
      } catch (error) {
        if (!didCancel) {
          setData({ status: 'rejected', error })
        }
      }
    }
    fetchData()

    return () => didCancel = true
  }, [key])

  return data
}

export const useResizer = (element, onResize) => {
  const [dimensions, setDimensions] = React.useState([])

  React.useLayoutEffect(() => {
    let didCancel = false
    const resizer = new ResizeObserver(entries => {
      let entry = entries[0]
      if (entry && !didCancel) {
        const { width, height } = entry.contentRect
        if (typeof onResize === 'function') {
          onResize([width, height])
        }
        setDimensions([width, height])
      }
    })

    resizer.observe(element.current)
    return () => {
      resizer.unobserve(element.current)
      didCancel = true
    }
  }, [element])
  
  return dimensions
}
