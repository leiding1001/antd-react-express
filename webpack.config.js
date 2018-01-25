'use strict';

const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const config = require('./config/config.js');

// Set the correct environment
let env = null;
if (process.env.NODE_ENV && config.environments.findIndex(it => it === process.env.NODE_ENV)!=-1) {
  env = process.env.NODE_ENV;
} else {
  env = config.environments[0];
}
console.log('----------------------------------------------');
console.log('编译项目: ', process.env.project);
console.log('当前环境: ', env);
console.log('webpack配置文件：', `./config/webpack.${env}.js`)
console.log('----------------------------------------------');
process.env.REACT_WEBPACK_ENV = env;

/**
 * Build the webpack configuration
 * @param  {String} wantedEnv The wanted environment
 * @return {Object} Webpack config
 */
function buildConfig(wantedEnv) {
  let config = require(path.join(__dirname, `./config/webpack.${wantedEnv}.js`));
  return config;
}

module.exports = buildConfig(env);
