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

app.use('*', (req, res) => {
  res.sendFile(`${dirname}/client/dist/index.html`)
})

app.listen(process.env.PORT || 9000, (err) => {
  console.log(err || `Started server on ${process.env.PORT || 9000}`)
})
