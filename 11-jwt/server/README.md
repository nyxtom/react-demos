# jwt

Server implementation for the react application making use of jwt authentication.

## Setup npm dependencies and package

Initialize npm package.json

```bash
npm init -y
```

Update `package.json` to include `type: "module"` so we can make use of module imports.

```json
{
  "type": "module"
}
```

Now install express so we can actually create a server

```bash
npm i -S express body-parser cookie-parser jsonwebtoken
```

## Create a simple web server

Setup a simple web server to handle parsing json body with `body-parser`, setting and verifying cookies with `cookie-parser`, jwt with `jsonwebtoken` and finally `express`.

```javascript
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

const dirname = path.resolve(
  path.join(
    path.dirname(new URL(import.meta.url).pathname),
    '/../'
  )
);
const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(`${dirname}/client/dist`))
app.use('*', (req, res) => {
  res.sendFile(`${dirname}/client/dist/index.html`)
})

app.listen(process.env.PORT || 9000, (err) => {
  console.log(err || `Started server on ${process.env.PORT || 9000}`)
})
```

This will serve up the client application built in `../client` for any url and rely upon the client to handle proper routing. Next we need to actually create some endpoints to authenticate the user credentials and generate an auth cookie.

## Authenticate with JWT

Using the `jwt.sign` function we can sign a token assuming that the authentication passes. We can return an httpOnly cookie with the response and let the browser handle the rest. Then we can protect any other routes with a `verifyJwt` function which will look for the `authcookie` before passing along to the next function.

```javascript
const SECRET_KEY = 'wittVGdQx1wCH39Ds8TywkuIX5hJrYJ5'
const MAX_AGE = 24 * 60 * 60

app.post('/auth/signin', (req, res) => {
  const { username, password } = req.body
  if (username !== 'foobar' || password !== 'password1234') {
    return res.sendStatus(400)
  }

  const token = jwt.sign({ user: username }, SECRET_KEY)
  res.cookie('authcookie', token, { maxAge: MAX_AGE, httpOnly: true })
})

app.post('/auth/signout', (req, res) => {
  res.clearCookie('authcookie')
})

const verifyJwt = (req, res, next) => {
  const authcookie = req.cookies.authcookie
  jwt.verify(authcookie, SECRET_KEY, (err, data) => {
    if (err) {
      res.sendStatus(403)
    } else if (data) {
      req.user = data.user
      next()
    }
  })
}

app.get('/me', verifyJwt, (req, res) => {
  res.json({ user: req.user })
})
```

## Run the app

Now we can run the whole application (after building the client with `webpack --config webpack.dev.config.js`)

```bash
node .
```
