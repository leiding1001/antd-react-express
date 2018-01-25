/**
 * api请求server
 * 
 * 
 * 测试：
 * 本地服务
 *    1. 在../config.js中设置
 *        isRemoteProxy = false;
 *    2. 在浏览器中访问 http://localhost:3001/ws/truck-trace/user/userInfo/
 * 远程服务
 *    1. 在../config.js中设置
 *        isRemoteProxy = true;
 *        remoteProxyUrl='http://ip.taobao.com:80'
 *    2. 在浏览器中访问 http://localhost:3001/ws/service/getIpInfo.php?ip=63.223.108.42
 */
import Express from 'express'
import config from '../../config/config'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import httpProxy from 'http-proxy';

const {
  apiHost,
  apiPort,
  isRemoteProxy,
  remoteProxyUrl
} = config;

const app = new Express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser('express_react_cookie'));
app.use(session({
  secret: 'express_react_cookie',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 1000 * 30
  } //过期时间
}));

//API 主入口
if (isRemoteProxy) { // 远程API服务
  const proxy = httpProxy.createProxyServer({
    target: remoteProxyUrl
  });
  // proxy.on('proxyReq', function(proxyReq, req, res, options) {
  //   console.log(proxyReq);
  // });
  app.use('/', (req, res) => {
    proxy.web(req, res, {
      target: remoteProxyUrl,
      changeOrigin: true
    });
  });
} else { // 本地API服务
  app.use('/', require('./main'));
}

app.listen(apiPort, function (err) {
  if (err) {
    console.error('err:', err);
  } else {
    console.info(`===> api server is running at ${apiHost}:${apiPort}`)
  }
});