import React from 'react'
import ReactDOM from 'react-dom'

import { TimeSeries } from './components/time-series'

import './App.css'

const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello World!</h1>
    </div>
    <div className="container">
      <TimeSeries />
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
