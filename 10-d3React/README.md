# d3

Basic implementation of react app using dozens of d3 visualizations without d3 directly manipulating the DOM

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Setup basic app structure

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello World!</h1>
    </div>
    <div className="container">
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

Setup a bit of css

```css
html, body {
  margin: 0px;
  padding: 0px;
  background: #fcfcfc;
  font-size: 12px;
}

h1 {
  font-size: 1.3rem;
  margin: 0px 1rem;
  padding: 0.5rem;
  font-weight: normal;
  color: #333;
}

/**
 * Header
 */
.header {
    padding: 4px;
    border-bottom: solid 1px #e9e9e9;
    box-shadow: 0px 1px 6px -3px #ccc;
    background: #fff;
    display: flex;
    z-index: 999;
    position: relative;
}

/**
 * Container
 */
.container {
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
}

/**
 * Widget
 */
.widget {
  width: 450px;
  height: 250px;
  margin: 0.25rem;
  background: #fff;
  border: solid 1px #f1f1f1;
  transition: all 0.15s ease-in-out;
  display: flex;
  flex-direction: column;
}
.widget h3 {
  margin: 0px;
  padding: 1rem 0.5rem 1.5rem;
  z-index: 1;
  color: #999;
  font-weight: normal;
  font-size: 1rem;
}
.widget-content {
  display: flex;
  flex-grow: 1;
  width: 100%;
  position: relative;
}
.widget-content.loading svg {
  opacity: 0;
}
.widget-content.resolved svg {
  opacity: 1;
  transition: all 1s ease-in-out;
}
.widget-content .alert {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100% - 20px);
  z-index: 1;
}
.widget-content .loading {
  color: #777;
}
.widget-content .error {
  color: red;
}
```

The CSS for widget is all setup so that we can create a number of widgets and reuse the same basic container styling, loading, and alerts.

## Widgets

We're going to create a series of widgets one by one without d3 directly manipulating the DOM. Install d3 with the dependencies

```bash
npm i --save d3
```

### Setup a useFetchCache utility

Since we will be commonly fetching data, let's create a `useFetchCache` utility that will retrieve a promise and cache the result into a fetch context.

```javascript
// src/utils.js
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
```

### Time Series

Inside `components/time-series.js` let's go ahead and re-create the time series we created in the `9-d3/` except this time using React to maintain the rendering and use D3 to just setup some functions and behaviors.

```javascript
// src/components/time-series.js
import React from 'react'
import * as d3 from 'd3'

import { useFetchCache } from '../utils'

const sampleUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

export const TimeSeries = ({ url = sampleUrl }) => {
  const vizRef = React.useRef()
  const { status, data, error } = useFetchCache(url, async () => {
    let response = await d3.csv(url)
    const parseDate = d3.timeParse('%Y-%m-%d')
    return response.map(d => {
      return { date: parseDate(d.date), value: d.value }
    })
  })

  const [lineData, setLineData] = React.useState({})

  React.useLayoutEffect(() => {
    if (!data) return
    const rect = vizRef.current.getBoundingClientRect()
    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, rect.width])
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value)])
      .range([rect.height, 0])
    const line = d3.line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
    setLineData({ data: line(data), x, y })
  }, [data])

  return (
    <div className="widget">
      <h3>{title}</h3>
      <div className={`widget-content ${status}`}>
        { status === 'loading' || error ? 
          <div className="alert">
            { status === 'loading' ? <span className="loading">Loading...</span> : null }
            { error ? <span className="error">{error.message}</span> : null }
          </div> : null
        }
        <svg ref={vizRef}>
          <path fill="none" stroke="steelblue" strokeWidth="1.5" d={lineData.data} />
        </svg>
      </div>
    </div>
  )
}
```

Great! We render out the path data directly and let d3 generate the line path after the layout has run. This will ensure that whenever the data changes we re-run the effect to grab the latest version of the path data. Along with the path data we are passing along the x and y functions in case we want to use it for hover functions. Unfortunately, this does nothing when the container actually resizes, so let's create a simple hook that will handle that.

Whenever the container resizes, we want to track that in order to update our path generator function. We can do that by creating a custom hook that will use a ResizeObserver.

```javascript
// src/utils.js
export const useResizer = (element) => {
  const [dimensions, setDimensions] = React.useState([])

  React.useLayoutEffect(() => {
    let didCancel = false
    const resizer = new ResizeObserver(entries => {
      let entry = entries[0]
      if (entry && !didCancel) {
        const { width, height } = entry.contentRect
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
```

Then in the `time-series` component, we just need to observe whenever the widget ref element changes and use that.

```javascript
import React from 'react'
import * as d3 from 'd3'

import { useFetchCache, useResizer } from '../utils'

const sampleUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

export const TimeSeries = ({ title = 'Time Series Sample', url = sampleUrl }) => {
  const vizRef = React.useRef()
  const widgetRef = React.useRef()
  const dimensions = useResizer(widgetRef)
  const { status, data, error } = useFetchCache(url, async () => {
    let response = await d3.csv(url)
    const parseDate = d3.timeParse('%Y-%m-%d')
    return response.map(d => {
      return { date: parseDate(d.date), value: d.value }
    })
  })

  const [lineData, setLineData] = React.useState({})

  React.useLayoutEffect(() => {
    if (!data) return
    const rect = vizRef.current.getBoundingClientRect()
    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, rect.width])
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value)])
      .range([rect.height, 0])
    const line = d3.line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
    setLineData({ data: line(data), x, y })
  }, [data, dimensions])

  return (
    <div className="widget" ref={widgetRef}>
      <h3>{title}</h3>
      <div className={`widget-content ${status}`}>
        { status === 'loading' || error ? 
          <div className="alert">
            { status === 'loading' ? <span className="loading">Loading...</span> : null }
            { error ? <span className="error">{error.message}</span> : null }
          </div> : null
        }
        <svg ref={vizRef}>
          <path fill="none" stroke="steelblue" strokeWidth="1.5" d={lineData.data} />
        </svg>
      </div>
    </div>
  )
}
```

The only change here is we have added the `widgetRef`, assigned `<div className="widget" ref={widgetRef}>` and used the `useResizer(widgetRef)` to get the current dimensions. Then we pass along `dimensions` as another dependency to the layout effect.

Go ahead and import this into the main `index.js` and should be good to go.

```javascript
// index.js
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
```

Since we plan on reusing the same widget container, let's create a `src/components/widget.js` to do the common widget headers and containers.

```javascript
// src/components/widget.js
import React from 'react'

import { useResizer } from '../utils'

export const Widget = ({ title, status, error, children, onResize }) => {
  const widgetRef = React.useRef()
  useResizer(widgetRef, onResize)

  return (
    <div className="widget" ref={widgetRef}>
      <h3>{title}</h3>
      <div className={`widget-content ${status}`}>
        { status === 'loading' || error ? 
          <div className="alert">
            { status === 'loading' ? <span className="loading">Loading...</span> : null }
            { error ? <span className="error">{error.message}</span> : null }
          </div> : null
        }
        {children}
      </div>
    </div>
  )
}
```

We need to update the `useResizer` to handle an onResize callback instead.

```javascript
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
```

Now in the `time-series` component, let's update it to use the `<Widget>` component instead.

```javascript
// src/components/time-series.js
import React from 'react'
import * as d3 from 'd3'

import { useFetchCache } from '../utils'
import { Widget } from './widget'

const sampleUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

export const TimeSeries = ({ title = 'Time Series Sample', url = sampleUrl }) => {
  const vizRef = React.useRef()
  const [dimensions, setDimensions] = React.useState([])
  const { status, data, error } = useFetchCache(url, async () => {
    let response = await d3.csv(url)
    const parseDate = d3.timeParse('%Y-%m-%d')
    return response.map(d => {
      return { date: parseDate(d.date), value: d.value }
    })
  })

  const [lineData, setLineData] = React.useState({})

  React.useLayoutEffect(() => {
    if (!data) return
    const rect = vizRef.current.getBoundingClientRect()
    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, rect.width])
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value)])
      .range([rect.height, 0])
    const line = d3.line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
    setLineData({ data: line(data), x, y })
  }, [data, dimensions])

  return (
    <Widget title={title} status={status} error={error} onResize={setDimensions}>
      <svg ref={vizRef}>
        <path fill="none" stroke="steelblue" strokeWidth="1.5" d={lineData.data} />
      </svg>
    </Widget>
  )
}
```

Great! That takes are of that. Now it will run with the resize observer, and handles all the status, error...etc state inside the widget container.

```bash
npm start
```

## Bar Chart

Now that we have a time series, lets go ahead and move along to the next visualization. We'll be creating a basic bar chart visualization using the same ideas we did in the `time-series` component. Go ahead and create a file in `src/components/bar-chart`

```javascript
// src/components/bar-chart.js
import React from 'react'
import * as d3 from 'd3'

import { useFetchCache } from '../utils'
import { Widget } from './widget'

const sampleUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

export const BarChart = ({ title = 'Bar Chart Sample', url = sampleUrl }) => {
  const vizRef = React.useRef()
  const [dimensions, setDimensions] = React.useState([])
  const { status, data, error } = useFetchCache(url, async () => {
    let response = await d3.csv(url)
    const parseDate = d3.timeParse('%Y-%m-%d')
    return response.map(d => {
      return { date: parseDate(d.date), value: d.value }
    })
  })

  const [bars, setBars] = React.useState([])

  React.useLayoutEffect(() => {
    if (!data) return
    const rect = vizRef.current.getBoundingClientRect()

    const rollup = d3
      .rollups(
        data,
        v => {
          return {
            min: d3.min(v, d => +d.value),
            max: d3.max(v, d => +d.value),
            avg: d3.mean(v, d => +d.value)
          }
        },
        d => d.date.getDate()
      )
      .map(entry => {
        return { key: entry[0], value: entry[1] }
      })

    const x = d3.scaleTime()
      .domain(d3.extent(rollup, (d) => d.key))
      .range([0, rect.width])

    const maxY = d3.scaleLinear()
      .domain([0, d3.max(rollup, (d) => +d.value.max)])
      .range([rect.height, 0])

    const barData = rollup.map(d => {
      return { 
        x: x(d.key),
        width: (rect.width / rollup.length),
        y: maxY(d.value.max),
        height: rect.height - maxY(d.value.max)
      };
    })
    setBars(barData)
  }, [data, dimensions])

  return (
    <Widget title={title} status={status} error={error} onResize={setDimensions}>
      <svg ref={vizRef}>
        <g className="bars">
          {bars.map(bar => <rect {...bar} fill="steelblue" />)}
        </g>
      </svg>
    </Widget>
  )
}
```

This takes advantage of `d3.rollup` to pass a `reducer` function with the first grouping being the first key `d.date.getDate()` - grouping the data by date in a month. We use this rollup data to generate an x and y scale/domain/range function before we create the bar data.

Import the `<BarChart>` into the app and we will see it rendered.

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import { TimeSeries } from './components/time-series'
import { BarChart } from './components/bar-chart'

import './App.css'

const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello World!</h1>
    </div>
    <div className="container">
      <TimeSeries />
      <BarChart />
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

Great! Now it will display both the time series and the bar chart now.

```bash
npm start
```
