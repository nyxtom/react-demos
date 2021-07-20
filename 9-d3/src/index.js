import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3';

import './App.css'

const FetchContext = React.createContext({})
const FetchCache = ({children}) => {
  const [cache] = React.useState({})
  return (
    <FetchContext.Provider value={cache}>
      {children}
    </FetchContext.Provider>
  )
}

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

const sampleUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

const Widget = ({ url = sampleUrl }) => {
  const vizRef = React.useRef()
  const { status, data, error } = useFetchCache(url, async () => {
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
      <div className={`widget-content ${status}`}>
        { status === 'loading' || error ? 
          <div className="alert">
            { status === 'loading' ? <span className="loading">Loading...</span> : null }
            { error ? <span className="error">{error.message}</span> : null }
          </div> : null
        }
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

ReactDOM.render(<App />, document.getElementById('root'))
