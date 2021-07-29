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
