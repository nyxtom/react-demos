import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

import { Name } from './components/Name'

const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello <Name name="Foo" />!</h1>
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
