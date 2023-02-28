const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('@koa/router')
const { koaBody } = require('koa-body')
const axios = require('axios')

const app = new Koa()
const router = new Router()

router.post('/github_access_token', async (ctx, next) => {
  const res = await axios.post('https://github.com/login/oauth/access_token', ctx.request.body)
  const params = new URLSearchParams(res.data)
  ctx.body = Array.from(params.entries()).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {})
  await next()
})

router.get('/', async (ctx, next) => {
  ctx.body = 'a cors proxy server!'
  await next()
})

app.use(cors())
app.use(koaBody())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(4001, () => {
  console.log("proxy代理服务启动：http://localhost:4001")
})