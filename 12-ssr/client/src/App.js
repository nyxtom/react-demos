import React from 'react'

const FetchContext = React.createContext({})
const FetchCache = ({ children, data = {} }) => (
  <FetchContext.Provider value={data}>
    {children}
  </FetchContext.Provider>
)
const useFetchCache = () => React.useContext(FetchContext)

const useFetch = (url) => {
  const cache = useFetchCache()

  const [data, setData] = React.useState(cache[url] || [])
  const [err, setErr] = React.useState(null)
  const [load, setLoad] = React.useState(false)

  React.useEffect(() => {
    if (cache[url]) return

    let didCancel = false
    setLoad(true)
    async function fetchData() {
      try {
        let res = await fetch(url)
        let json = await res.json()
        if (!didCancel) {
          setData(json)
          setLoad(false)
        }
      } catch (err) {
        if (!didCancel) {
          setErr(err)
          setLoad(false)
        }
      }
    }
    fetchData()
    return () => didCancel = true
  }, [url, cache])

  return [data, err, load]
}

const DataList = () => {
  const [data, err, load] = useFetch('/posts')

  return (
    <>
    { err ? <div className="error">{err.message}</div> : null }
    { load ? <div className="message">Loading...</div> : null }
    <ul>
      {data.map(d => (
        <li key={d.id}>
          <h3>{d.title}</h3>
          <pre>{d.body}</pre>
        </li>
      ))}
    </ul>
    </>
  )
}

const App = ({ cache }) => {
  return (
    <div id="app">
      <FetchCache data={cache}>
        <DataList />
      </FetchCache>
    </div>
  )
}

export default App
