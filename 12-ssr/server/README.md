## ssr

Simple application demonstrating how to implement server side rendering with react.

### Basic server application setup

In order to get server side rendering working, we need a working server to build. We will be reusing `babel`, `webpack`, and `react` to get the server rendering working for express.

## Setup dependencies

```bash
npm i --save express react react-dom
```

Then for babel/eslint/webpack we will use the same dev dependencies as the rest of the samples.

```bash
npm i --save-dev @babel/core @babel/eslint-parser @babel/plugin-transform-runtime @babel/preset-env @babel/preset-react @babel/runtime babel-loader css-loader eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks html-webpack-plugin postcss-loader prettier style-loader webpack webpack=cli webpack-dev-server webpack-node-externals
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
app.use(express.static(CLIENT_DIST))

app.use('/', (req, res) => {
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

app.listen(process.env.PORT || 9000, (err) => {
  console.log(err || `Started server on ${process.env.PORT || 9000}`)
})
```

That's it!

## Run the app

```bash
node dist/main.js
```
