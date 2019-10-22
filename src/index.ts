import express, { Request, Response } from 'express'
import handlebars from 'express-handlebars'
import fetchConfig from './fetchConfig'
import qs from 'querystring'

const app = express()

export const hive = {
  public: 'http://console.cloud.ory.local/.ory/hive/public',
}

app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.static('node_modules/normalize.css'))

app.engine(
  'hbs',
  handlebars({
    extname: 'hbs',
    layoutsDir: `${__dirname}/../views/layouts/`,
    partialsDir: `${__dirname}/../views/partials/`,
    defaultLayout: 'main',
  })
)

const redirectOnFail = (res: Response, type: 'login' | 'registration') => {
  res.redirect(`${hive.public}/auth/browser/${type}`)
}

const authHandler = (type: 'login' | 'registration') => (
  req: Request,
  res: Response
) => {
  const { request } = qs.parse(req.url.substr(req.url.search('\\?') + 1))

  if (!request) {
    redirectOnFail(res, type)
    return
  }

  fetchConfig(type, request).then(request => {
    const {
      config: {
        fields: { csrf_token, identifier, 'traits.email': email },
        action,
        errors,
      },
    } = request.methods.password

    if (!csrf_token) {
      redirectOnFail(res, type)
      return
    }

    res.render(type, {
      formAction: action,
      csrfToken: csrf_token.value,
      identifier: identifier ? identifier.value : '',
      errors,
      email: email ? email.value : '',
    })
  })
}

app.get('/register', authHandler('registration'))

app.get('/login', authHandler('login'))

const port = Number(process.env.PORT) || 3000

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
