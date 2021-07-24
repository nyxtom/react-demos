import React from 'react'
import * as d3 from 'd3'

import { useFetchCache } from '/utils'
import { Widget } from './widget'

const sampleUrl = 'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'

export const AreaChart = ({ title = 'Area Series Sample', url = sampleUrl, margin = 20 }) => {
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
    const height = rect.height - margin * 2 
    const width = rect.width
    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width])
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value)])
      .range([height, 0])
    const line = d3.area()
      .x((d) => x(d.date))
      .y1((d) => y(d.value))
    line.y0(y(0))

    d3.select(vizRef.current)
      .select('.axis.y')
      .call(d3.axisRight(y));

    d3.select(vizRef.current)
      .select('.axis.x')
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    setLineData({ data: line(data), x, y })
  }, [data, dimensions])

  return (
    <Widget title={title} status={status} error={error} onResize={setDimensions}>
      <svg ref={vizRef}>
        <g transform={`translate(0, ${margin})`}>
          <g className="axis x"></g>
          <g className="axis y"></g>
          <path fill="steelblue" d={lineData.data} />
        </g>
      </svg>
    </Widget>
  )
}
