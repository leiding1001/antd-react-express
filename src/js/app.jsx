import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes.jsx';

import '../css/theme.less';
import {AppContainer} from 'react-hot-loader';

/*
 * React-hot-loader 热启动
 */

ReactDOM.render(
  <AppContainer >
    <Routes />
  </AppContainer >,
  document.getElementById('content')
);

if(module.hot && process.env.NODE_ENV !== 'dist'){
  module.hot.accept();
}
 