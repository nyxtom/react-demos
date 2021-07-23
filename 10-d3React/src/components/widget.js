import React from 'react'

import { useResizer } from '/utils'

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
