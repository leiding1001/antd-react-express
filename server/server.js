/**
 * http://expressjs.com/
 * http://www.expressjs.com.cn/
 */
import path from 'path';
import Express from 'express';
import httpProxy from 'http-proxy';
import compression from 'compression';
import connectHistoryApiFallback from 'connect-history-api-fallback';
import config from '../config/config';

const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');
const app = new Express();

const {
  host: serverHost,
  port: serverPort,
  apiHost,
  apiPort
} = config;

const targetUrl = `http://${apiHost}:${apiPort}`;
const proxy = httpProxy.createProxyServer({
  target: targetUrl
});
// 代理'/ws' 必须写在app.use('/'）前面，防止被覆盖
app.use('/ws', (req, res) => {
  proxy.web(req, res, {
    target: targetUrl
  });
});

app.use(compression());
app.use('/', connectHistoryApiFallback());
app.use('/', Express.static(path.join(__dirname, "..", 'build')));
app.use('/', Express.static(path.join(__dirname, "..", 'static')));

//热更新
if (process.env.NODE_EVN !== 'production') {
  const compiler = Webpack(webpackConfig);

  app.use(WebpackDevMiddleware(compiler, {
    publicPath: '/',
    historyApiFallback: true,
    inline: true,
    stats: {
      colors: true
    },
    lazy: false,
    watchOptions: {
      aggregateTimeout: 3000,
      poll: true
    },
  }));
  app.use(WebpackHotMiddleware(compiler));
}

app.listen(serverPort, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log(`===>open http://${serverHost}:${serverPort} in a browser to view the app`);
  }
});