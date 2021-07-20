# d3

Basic implemenation of react app using d3 visualizations

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Setup basic app structure

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

const Widget = () => {
  return (
    <div className="widget">
      <h3>Title</h3>
      <div className="widget-content">
        <svg></svg>
      </div>
    </div>
  )
}

const createWidgets = () => {
  return Array(10).fill(0).map(i => {
    return (<Widget />)
  })
}

const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello World!</h1>
    </div>
    <div className="container">
      {createWidgets()}
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

## Update the styles a bit for navigation

```css
html, body {
  margin: 0px;
  padding: 0px;
  background: #f9f9f9;
  font-size: 12px;
}

h1 {
  font-size: 2rem;
  margin: 0px;
  padding: 0.5rem;
}

/**
 * Header
 */
.header {
    padding: 4px;
    border-bottom: solid 1px #d9d9d9;
    box-shadow: 0px 1px 6px -2px #aaa;
    background: #fff;
    display: flex;
    z-index: 999;
    position: relative;
}

/**
 * Container
 */
.container {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
}
```

## Install d3 dependency

```bash
npm i --save d3
```

## Create a widget container

```javascript
import * as d3 from 'd3'

const Widget = () => {
  const vizRef = React.useRef()

  return (
    <div className="widget">
      <h3>Title</h3>
      <div className="widget-content">
        <svg ref={vizRef}></svg>
      </div>
    </div>
  )
}
```

## Update styles for widget content

```css
/**
 * Widget
 */
.widget {
  width: 500px;
  height: 300px;
  margin: 1rem;
  background: #fff;
  box-shadow: 0px 1px 4px -2px #ddd;
  border: solid 1px #eee;
  transition: all 0.15s ease-in-out;
  display: flex;
  flex-direction: column;
}
.widget:hover {
  box-shadow: 0px 1px 4px -2px #444;
}
.widget h3 {
  margin: 0px;
  padding: 1rem;
  z-index: 1;
  border-bottom: solid 1px #eee;
}
.widget-content {
  display: flex;
  flex-grow: 1;
  width: 100%;
  background: #fcfcfc;
}
```

## Create a useEffect to tap into svg and render from fetch data

```javascript
const useSampleData = () => {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    let didCancel = false

    async function fetchData() {
      let data = await d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv') 
      const parseDate = d3.timeParse('%Y-%m-%d')
      data = data.map(d => {
        return { date: parseDate(d.date), value: d.value }
      })

      if (!didCancel) {
        setData(data)
      }
    }

    fetchData()

    return () => didCancel = true
  }, [])

  return data
}
```

This will retrieve some sample data and we can now use it in the widget.

## Process sample data into simple time series widget with d3

```javascript
const Widget = () => {
  const vizRef = React.useRef()
  const data = useSampleData()

  React.useEffect(() => {
    if (!data.length) {
      return
    }

    const svg = d3.select(vizRef.current)
    const rect = vizRef.current.getBoundingClientRect()

    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, rect.width])

    svg.append('g')
      .attr('transform', 'translate(-1, ' + rect.height + ')')
      .call(d3.axisTop(x))

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value)])
      .range([rect.height, 0])

    svg.append('g')
      .attr('transform', 'translate(-1, 0)')
      .call(d3.axisRight(y))

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x((d) => x(d.date))
        .y((d) => y(d.value))
      )
  }, [data])

  return (
    <div className="widget">
      <h3>Title</h3>
      <div className="widget-content">
        <svg ref={vizRef}></svg>
      </div>
    </div>
  )
}
```

Note this is purely allowing d3 to manipulate the DOM after the browser has already painted (allowing useEffect to run). There are some scenarios of using d3 that will let React render what it needs to in the tree based on the data and use d3 purely for the scaling, and data points. Rather than use `svg.append('path').attr('d', d3.line())` we would use the `d3.line()` function separate and generate the output for the `d` data attribute on the path.

## Cache Requests with useContext

Right now the useSampleData is retrieving the sample data for every single widget. We need this to cache the request such that we aren't making the same request over and over. To solve this, we will create a FetchContext 

```javascript
const FetchContext = React.createContext({})
const FetchCache = ({children}) => {
  const [cache] = React.useState({})
  return (
    <FetchContext.Provider value={cache}>
      {children}
    </FetchContext.Provider>
  )
}
```

Pretty straight forward, the `FetchContext` will store an empty object when we call use fetch. This needs to be wrapped at the beginning of the app. Let's do that now.

```javascript
const App = () => (
  <div id="app" className="center">
    <div className="header">
      <h1>Hello World!</h1>
    </div>
    <div className="container">
      <FetchCache>
        {createWidgets()}
      </FetchCache>
    </div>
  </div>
)
```

In order to actually use the cache we will use the `useContext` to retrieve the context data and manipulate it as fetch requests are made. Let's implement the `useFetchCache` function now.

```javascript
const useFetchCache = (url, fetchCallback) => {
  const cache = React.useContext(FetchContext)
  const [data, setData] = React.useState({ status: 'loading', url })

  React.useEffect(() => {
    let didCancel = false

    setData({ status: 'loading', url })
    async function fetchData() {
      if (!cache[url]) {
        cache[url] = fetchCallback(url)
      }
      try {
        let result = await cache[url]
        if (!didCancel) {
          setData({ status: 'resolved', url, data: result })
        }
      } catch (error) {
        if (!didCancel) {
          setData({ status: 'rejected', error })
        }
      }
    }
    fetchData()

    return () => didCancel = true
  }, [url])

  return data
}
```

Great! Now the widget can call `useFetchCache` passing along the url and the callback to execute on the first try. This is a bit similar to `useState` except it is backed by a context cache. Update the widget component to take advantage of this.

```javascript
const sampleUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

const Widget = ({ url = sampleUrl }) => {
  const vizRef = React.useRef()
  const { data } = useFetchCache(url, async () => {
    let response = await d3.csv(url)
    const parseDate = d3.timeParse('%Y-%m-%d')
    return response.map(d => {
      return { date: parseDate(d.date), value: d.value }
    })
  })

  React.useEffect(() => {
    if (!data) {
      return
    }

    const svg = d3.select(vizRef.current)
    const rect = vizRef.current.getBoundingClientRect()

    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, rect.width])

    svg.append('g')
      .attr('transform', 'translate(-1, ' + (rect.height + 1) + ')')
      .call(d3.axisTop(x))

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value)])
      .range([rect.height, 0])

    svg.append('g')
      .attr('transform', 'translate(-1, 0)')
      .call(d3.axisRight(y))

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line().x((d) => x(d.date)).y((d) => y(d.value)))
  }, [data])

  return (
    <div className="widget">
      <h3>Title</h3>
      <div className="widget-content">
        <svg ref={vizRef}></svg>
      </div>
    </div>
  )
}

const createWidgets = () => {
  return Array(50).fill(0).map(() => {
    return (<Widget />)
  })
}
```

Awesome! Now the fetch is cached and we don't have to worry about the same data being requested over and over. This can alternatively be done by raising the state to the parent component and doing it that way.

## Add some loading indicators

```css
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

Now update the `Widget` component to take advantage of the `status` returned from `useFetchCache`.

```javascript
const { status, data, error } = useFetchCache(url, async () => {...})

React.useEffect(() => {...})

return (
  <div className="widget">
    <h3>Title</h3>
    <div className={`widget-content ${status}`}>
      { status === 'loading' ? <span className="loading">Loading...</span> : null }
      { error ? <span className="error">{error.message}</span> : null }
      <svg ref={vizRef}></svg>
    </div>
  </div>
)
```

## Run the app

```bash
npm start
```
