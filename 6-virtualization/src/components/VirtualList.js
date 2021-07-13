import React from 'react'

import { useResize, useContainerHeight } from '../virtual-utils'

export const layouts = {
  vertical: {
    inner: ({ dimensions, layout, length }) => {
      return layout.height * length
    },
    item: ({ length, layout, scrollTop, containerHeight }) => {
      const pageSize = Math.floor((2 * containerHeight) / layout.height)

      const startIndex = Math.min(
        length - 1,
        Math.max(0, Math.floor(scrollTop / layout.height) - pageSize)
      )
      const endIndex = Math.min(
        length - 1,
        startIndex + pageSize * 2
      )

      const itemWidth = layout.width || '100%'
      const itemHeight = layout.height

      return {
        startIndex,
        endIndex,
        itemHeight,
        itemWidth
      }
    },
  },
  grid: {
    inner: ({ dimensions, layout, length }) => {
      const maxCols = Math.floor(dimensions[1] / layout.width)
      return (length / maxCols) * layout.height
    },
    item: ({ length, layout, scrollTop, containerHeight, dimensions }) => {
      const minItemWidth = layout.width
      const minItemHeight = layout.height
      const maxCols = Math.floor(dimensions[1] / minItemWidth)

      const itemWidth = parseInt(dimensions[1] / maxCols)
      const itemHeight = (minItemHeight / minItemWidth) * itemWidth

      const pageHeightSize = Math.floor((2 * containerHeight) / itemHeight)
      const pageSize = pageHeightSize * maxCols

      const startIndex = Math.min(
        length - 1,
        Math.max(0, maxCols * Math.floor(scrollTop / itemHeight))
      )

      const endIndex = Math.min(
        length - 1,
        startIndex + pageSize * 2
      )

      return {
        startIndex,
        endIndex,
        itemWidth,
        itemHeight,
        maxCols
      }
    }
  }
}

/**
* To get virtual lists to work properly, consider what it is doing.
* 1. It is a container that can scroll. 
* 2. The scrollbar is based on the hypothetical height of **all** items
* 3. It has an visible height for what can actually be visible
* 4. Visible items start at a startIndex, end at endIndex
* 5. Start and end indices are based on current scroll position
*/
export const VirtualList = ({ length, layout, render, calculate = layouts.vertical }) => {
  const element = React.useRef()
  const dimensions = useResize()
  const containerHeight = useContainerHeight({
    element,
    dimensions,
    layout
  })

  const [params, setParams] = React.useState([])
  const [scrollTop, setScrollTop] = React.useState(0)

  const innerHeight = React.useCallback(() => {
    return calculate.inner({ dimensions, layout, length })
  }, [...dimensions, layout, length])()

  // subscribe to container height, length, scrollTop, layout
  // to update the current start and end index
  React.useLayoutEffect(() => {
    setParams(calculate.item({
      length,
      layout,
      scrollTop,
      containerHeight,
      dimensions
    }))
  }, [length, layout, scrollTop, containerHeight, ...dimensions, calculate]);

  // update scroll top whenever this is called
  const onScroll = React.useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop)
  })

  return (
    <div className="virtual-container" ref={element} style={{ overflow: 'auto', height: containerHeight }} onScroll={onScroll}>
      <div style={{ position: 'relative', height: innerHeight }}>
        {typeof render === 'function' ? render(params) : null}
      </div>
    </div>
  )
}
