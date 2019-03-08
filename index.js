const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const logger = require('koa-logger');

const app = new Koa();

app.use(bodyParser());

// log all events to the terminal
app.use(logger());

// error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

// instantiate our new Router
const router = new Router({
  prefix: '/api'
});
// require our external routes and pass in the router
require('./routes/api')({ router });

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 8094;

const server = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}`)
);
module.exports = server;
