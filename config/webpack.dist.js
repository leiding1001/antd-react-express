const pathLib = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const ROOT_PATH = pathLib.resolve(__dirname, '..');
const SOURCE_PATH = pathLib.resolve(ROOT_PATH, 'src');
const ENTRY_PATH = pathLib.resolve(SOURCE_PATH, 'js');
const OUTPUT_PATH = pathLib.resolve(ROOT_PATH, 'build');

// 引入theme配置
const theme = config.theme();

module.exports = {
  entry: {
    index: ['babel-polyfill', pathLib.resolve(ENTRY_PATH, 'app.jsx')],
    common: ['react', 'react-dom', 'react-router-dom']
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: '/',
    filename: '[name]-[hash:8].js'
  },
  devtool: 'source-map',
  module: {
    rules: [{
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        })
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [{
              loader: "css-loader",
              options: {
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                modifyVars: theme
              }
            }
          ],
          fallback: 'style-loader'
        }),
      },
      {
        test: /\.(png|jpg|gif|JPG|GIF|PNG|BMP|bmp|JPEG|jpeg)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }]
      },
      {
        test: /\.(ttf|eot|svg|woff)(\?(\w|#)*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanPlugin(['build', '*-build'], {
      root: ROOT_PATH
    }),
    new ProgressBarPlugin(),
    new CopyWebpackPlugin([{
        from: 'src/static/video/pt.mp4'
      },
      {
        from: 'src/static/video/pt.webm'
      },
      {
        from: 'robots.txt'
      }
    ]),
    new webpack.optimize.AggressiveMergingPlugin(), //改善chunk传输
    new webpack.NoEmitOnErrorsPlugin(), //保证出错时页面不阻塞，且会在编译结束后报错
    new webpack.HashedModuleIdsPlugin(), //用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化
    new webpack.optimize.CommonsChunkPlugin({
      names: ['common'],
      children: true,
      // (选择所有被选 chunks 的子 chunks)

      async: true,
      // (创建一个异步 公共chunk
      minChunks: function (module) {
        return module.context && module.context.includes("node_modules");
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      comments: false,
      ie8: true
    }),
    new HtmlWebpackPlugin({
      title: 'Vanilla',
      inject: true,
      showErrors: true,
      template: pathLib.resolve(SOURCE_PATH, 'index.html')
    }),
    new webpack.DefinePlugin({
      "progress.env.NODE_ENV": JSON.stringify('dist')
    }),
    new ExtractTextPlugin({
      filename: '[name]-[hash:6].css',
      disable: false,
      allChunks: true,
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.sass', '.scss', '.less', 'jsx']
  }
};