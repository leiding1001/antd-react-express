import React from 'react';
import { Route, Router } from 'react-router-dom';
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import createHistory from 'history/createHashHistory';
import test from './test/test.jsx';
const history = createHistory();

export default class App extends React.Component {

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      // this.props.currentAnimate('normal')
    });
  }

  render() {

    return (
      <Router history={history}>
        <Route render={({ location }) => {
          return(
            <Route component={test} exact location={location} path="/" />
          );
        }}
        />
      </Router>
    );
  }
}