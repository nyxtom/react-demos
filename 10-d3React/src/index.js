import React from 'react'
import ReactDOM from 'react-dom'

import { TimeSeries } from '/components/time-series'
import { BarChart } from '/components/bar-chart'
import { ScatterPlot } from '/components/scatter-plot'
import { AreaChart } from '/components/area-chart'

import './App.css'

const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>D3</h1>
    </div>
    <div className="container">
      <TimeSeries />
      <BarChart />
      <ScatterPlot />
      <AreaChart />
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
