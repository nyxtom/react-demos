import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

const App = () => (
  <div id="app">
    <header>
      <h1>Hello world</h1>
    </header>
    <div className="container">
      <section className="sidebar">Sidebar</section>
      <section className="content">Messages</section>
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
