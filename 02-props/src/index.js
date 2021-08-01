import React from 'react'
import ReactDOM from 'react-dom'

import './App.css'

import { Name } from './components/Name'
import { Article } from './components/Article'

const createArticles = () => {
  let articles = []
  for (let i = 0; i < 10; i++) {
    articles.push((
      <Article hash="creating-components-with-props" title="Creating Custom Components" author="Tom" text="We are going to create some custom components..." />
    ))
  }
  return articles
}

const App = () => (
  <div id="app" className="center">
    <header className="header">
      <h1>Hello <Name name="Foo" />!</h1>
    </header>
    <div className="container">
      {createArticles()}
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
