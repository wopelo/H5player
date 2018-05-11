//使用koa复写入口文件
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const serve = require('koa-static');

const app = new Koa();
const router = new Router();

app.use(serve('./primordial'));
app.use(koaBody()).use(router.routes());


app.listen(3000);
