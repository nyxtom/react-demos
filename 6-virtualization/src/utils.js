import { useState, useEffect } from 'react'

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
