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

const CLIENT_INDEX = `${dirname}/client/dist/index.html`

const app = express()

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

    let template = data.replace(/<div id=\"root\">\s*<\/div>/, `<div id="root">${root}</div><script type="text/javascript">window.__INITIAL_STATE = ${JSON.stringify(cache)};</script>`)
    return res.send(template)
  })
})

app.use(express.static(`${dirname}/client/dist`))

app.listen(process.env.PORT || 9000, (err) => {
  console.log(err || `Started server on ${process.env.PORT || 9000}`)
})
