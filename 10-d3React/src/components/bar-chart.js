import React from 'react'
import * as d3 from 'd3'

import { useFetchCache } from '/utils'
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
