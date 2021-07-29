## ssr

Simple application demonstrating how to implement server side rendering with react.

### Basic server application setup

In order to get server side rendering working, we need a working server to build. We will be reusing `babel`, `webpack`, and `react` to get the server rendering working for express.

## Setup dependencies

```bash
npm i --save express react react-dom
```

Then for babel/eslint/webpack we will use the same dev dependencies as the rest of the samples. Setup dev dependencies for babel below.

```bash
npm i --save-dev @babel/core @babel/plugin-transform-runtime @babel/runtime @babel/preset-env @babel/preset-react @babel/eslint-parser babel-loader
```

Then setup dependencies for eslint and prettier

```bash
npm i --save-dev eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks prettier
```

Then setup dependencies for webpack

```bash
npm i --save-dev webpack webpack-cli webpack-node-externals
```

Finally, setup `nodemon` and `npm-run-all` for a few scripts

```bash
npm i --save-dev nodemon npm-run-all
```

Within scripts we can add some build scripts to help build things through webpack and run the web server.

```json
{
  "scripts": {
    "build": "NODE_ENV=development webpack --config webpack.server.js --mode=development -w",
    "dev": "nodemon ./dist/main.js",
    "start": "npm-run-all --parallel build dev"
  }
}
```

## Setup webpack

In a `webpack.server.js` we will implement the webpack bundling to be able to run babel over the `src/index.js` such that our `<App />` jsx will be transformed and all that.

```javascript
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/transform-runtime'],
          },
        },
      }
    ],
  }
}
```

## Configure babel.config.json

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

## src/index.js express app

Now we just need to implement the `express` app that can import the `<App/>` before rendering it on the `/` get request.

```javascript
// src/index.js
import express from 'express'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs'

import App from '../../client/src/App.js'

const dirname = path.resolve(
  path.join(
    path.dirname(new URL(import.meta.url).pathname),
    '/../../'
  )
);

const CLIENT_DIST = path.resolve(`${dirname}/client/dist`)
const CLIENT_INDEX = path.resolve(`${dirname}/client/dist/index.html`)

const app = express()

app.get('/', (req, res) => {
  const root = ReactDOMServer.renderToString(<App />)
  fs.readFile(CLIENT_INDEX, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send(`Something went wrong...`)
    }

    return res.send(
      data.replace(`<div id="root"></div>`, `<div id="root">${root}</div>`)
    )
  })
})

app.use(express.static(CLIENT_DIST))

app.listen(process.env.PORT || 9000, (err) => {
  console.log(err || `Started server on ${process.env.PORT || 9000}`)
})
```

Now this will render out the `<App />` on the server side and the client will `hydrate` the application in react.

## Add data fetching

We're going to update the sample now to add support for simple data fetching. Data fetching will need to be handled in such a way that we can pass along the cache to the client that way client-side fetching is skipped in these cases.

```javascript
app.get('/posts', (req, res) => {
  res.json([
    { id: '1', title: 'Hello world', body: 'Lorem ipsum' },
    { id: '2', title: 'Hello world 2', body: 'Lorem ipsum 2' }
  ])
})

app.get('/', (req, res) => {
  const cache = {}
  if (!req.query.refresh || req.query.refresh === 'false') {
    cache['/posts'] = [
      { id: '1', title: 'default data hello', body: 'Lorem ipsum 999' },
      { id: '2', title: 'default world 2', body: 'Lorem ipsum x' }
    ]
  }
  const root = ReactDOMServer.renderToString(<App cache={cache} />)
  fs.readFile(CLIENT_INDEX, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send(`Something went wrong...`)
    }

    let template = data.replace(`<div id="root"></div>`, `<div id="root">${root}</div><script type="text/javascript">window.__INITIAL_STATE = ${JSON.stringify(cache)};</script>`)
    return res.send(template)
  })
})
```

These server routes will respond to get requests on `/posts` and in the case of the initial render `/` will setup the default cache data and pass it along to the `<App cache={cache} />`.

## Run the app

```bash
npm start
```
