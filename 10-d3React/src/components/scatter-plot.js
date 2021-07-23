import React from 'react'
import * as d3 from 'd3'

import { useFetchCache } from '../utils'
import { Widget } from './widget'

export const ScatterPlot = ({ title = 'Scatter Plot' }) => {
  const vizRef = React.useRef()
  const [dimensions, setDimensions] = React.useState([])
  const { status, data, error } = useFetchCache('random', async () => {
    let points = []
    for (let i = 0; i < 100; i++) {
      points.push({
        x: i * 1000,
        y: i * Math.log(Math.random() * 20) * 2000,
        r: Math.log2(i) * Math.random()
      })
    }
    return points
  })

  const [points, setPoints] = React.useState([])

  React.useLayoutEffect(() => {
    if (!data) return
    const rect = vizRef.current.getBoundingClientRect()
    const x = d3.scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([0, rect.width])
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .range([rect.height, 0])
    const points = data.map(d => {
      return { x: x(d.x), y: y(d.y), r: d.r }
    })
    setPoints(points)
  }, [data, dimensions])

  return (
    <Widget title={title} status={status} error={error} onResize={setDimensions}>
      <svg ref={vizRef}>
        {points.map(p => <circle fill="steelblue" cx={p.x} cy={p.y} r={p.r} />)}
      </svg>
    </Widget>
  )
}
