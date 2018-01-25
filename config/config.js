module.exports = {
  environments: ['dev', 'dist', 'test'],

  host: process.env.HOST || 'localhost',
  port: process.env.PORT || (process.env.NODE_ENV === 'dist' ? 8080 : 3001),
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || '3030',
  // 远程API服务代理  
  isRemoteProxy: false,
  // 远程API服务代理URL
  remoteProxyUrl: 'http://ip.taobao.com:80',
  
  theme: (project) => {
    return require('./theme.js');
  }
};