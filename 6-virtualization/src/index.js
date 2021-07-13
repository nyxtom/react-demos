import React from 'react'
import ReactDOM from 'react-dom'

import { useFetch } from './utils'
import { PostList } from './components/PostList'
import { PostGrid } from './components/PostGrid'

import './App.css'

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
