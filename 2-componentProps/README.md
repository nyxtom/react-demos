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
```

### Run the app

```bash
npm start
```
