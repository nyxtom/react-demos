import React from 'react'
import ReactDOM from 'react-dom'
import { useLocation, useParams, useRouteMatch, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import './App.css'

const Home = () => (
  <div>Home</div>
)

const Dashboard = () => (
  <div>Dashboard</div>
)

const Topic = () => {
  const params = useParams()
  const match = useRouteMatch()
  const location = useLocation()
  const { path, url } = match
  console.log({ params, match, path, location })

  return (
    <div>
      <h3>Topic: {params.topicId}</h3>
    </div>
  )
}

const App = () => (
  <Router>
    <div id="app" className="center">
      <div className="header">
        <h1>Hello World!</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/topics/1234">Topic 1234</Link></li>
        </ul>
      </div>
      <div className="container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/topics/:topicId" component={Topic} />
        </Switch>
      </div>
    </div>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'))
