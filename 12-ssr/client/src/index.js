import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

ReactDOM.hydrate(<App cache={window.__INITIAL_STATE} />, document.getElementById('root'))
