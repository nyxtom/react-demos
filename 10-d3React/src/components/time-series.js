import React from 'react'
import * as d3 from 'd3'

import { useFetchCache } from '/utils'
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
