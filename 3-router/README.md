# component-props

Basic implementation of react app using components with props with variations on functional vs class components.

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Extending 2-componentProps

Now that we have some basic idea of components, let's extend this to navigate between an actual article page and a list of articles.

## Add dependencies for react router dom

```bash
npm i --save react-router-dom
```

## Import the browser router in index

* To use the router, we need to import `BrowserRouter` from `react-router-dom` inside `index.js`.
* To render a component based on a conditional switch, use `Switch`
* To match on a conditional render `Switch` against a route use `Route`
* To link to another route use `Link`

```javascript
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
```

## Update the styles a bit for navigation

```css
html, body {
  margin: 0px;
  padding: 0px;
  background: #f9f9f9;
  font-size: 12px;
}

h1 {
  font-size: 2rem;
  margin: 0px;
  padding: 0.5rem;
}

a, a:visited {
  color: #597899;
  text-decoration: none;
}

ul li {
  list-style: none;
  float: left;
  margin-right: 1.5rem;
  font-size: 1.2rem;
}

/**
 * Header
 */
.header {
    padding: 4px;
    border-bottom: solid 1px #d9d9d9;
    box-shadow: 0px 1px 6px -2px #aaa;
    width: 100%;
    background: #fff;
    display: flex;
    z-index: 999;
    position: relative;
}

/**
 * Container
 */
.container {
  padding: 1rem;
}
```

## Run the app

```bash
npm start
```
