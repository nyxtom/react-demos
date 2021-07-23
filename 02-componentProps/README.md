# component-props

Basic implementation of react app using components with props with variations on functional vs class components.

## Project Setup Based on 1-helloworld

ESLint, Webpack, Babel, React, Prettier..etc are all configured based on **1-helloworld** application. Use that project to get going or use `create-react-app`. Note that `1-helloworld` does not use `create-react-app` and sets all the basic things up step by step.

## Basic components

* Add a component in `components/Name`

    ```javascript
    import React from 'react'

    export const Name = ({ name }) => (
      <span style={{ color: 'red', fontWeight: 'bold' }}>{name}</span>
    )
    ```

* Import `Name` in `index.js`

    ```javascript
    import React from 'react'
    import ReactDOM from 'react-dom'

    import './App.css'

    import { Name } from './components/Name'

    const App = () => (
      <div id="app" className="center">
        <div className="header">
          <h1>Hello <Name name="Foo" />!</h1>
        </div>
      </div>
    )

    ReactDOM.render(<App />, document.getElementById('root'))
    ```

## Add a bit of css

In a file `src/App.css` add a bit of flair to the app with a header

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

### Add a custom class component

Implement a custom class based component `src/components/Article.js`

```javascript
import React from 'react'

import './Article.css'

export class Article extends React.Component {
  render() {
    return (
      <article id={this.props.hash}>
        <div className="title">{this.props.title}</div>
        <div className="author">By <strong>{this.props.author}</strong></div>
        <pre>{this.props.text}</pre>
      </article>
    )
  }
}
```

Add a bit of css to the `src/components/Article.css`

```css
article {
  background: #fff;
  white-space: wrap;
  display: block;
  padding: 2rem;
  margin: 2rem;
  float: left;
}
article .title {
  color: #8989aa;
  font-weight: bold;
  font-size: 1rem;
}
article .author {
  font-style: italic;
  font-size: 0.9rem;
}
```

### Update index to include the articles

Add a generation of articles by importing `Article` and creating a list from a simple function

```javascript
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
```

### Run the app

```bash
npm start
```
