import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import './App.css'

const Home = () => (
  <div>Home</div>
)

const Dashboard = () => (
  <div>Dashboard</div>
)

const App = () => (
  <Router>
    <div id="app" className="center">
      <div className="header">
        <h1>Hello World!</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </div>
      <div className="container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </div>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'))
