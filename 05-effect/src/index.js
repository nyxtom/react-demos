import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

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
        setState('rejected')
        setError(err)
      }
    }

    fetchData()

    return () => didCancel = true
  }, [url])

  return [ state, response, error ]
}

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

ReactDOM.render(<App />, document.getElementById('root'))
