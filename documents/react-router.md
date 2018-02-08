<font size=2>

# React-Router

## Installation

React-Router 包说明：
react-router: 提供核心的路由组件与函数。
react-router-dom: web 开发，所需的特定组件
react-router-native: 移动应用的开发环境使用 React Native，所需的特定组件

```bash
npm install --save react-router-dom
```

## 路由器(Router)
  BrowserRouter: 存在服务区来管理动态请求时，需要使用<BrowserRouter>组件</br>
  HashRouter: 被用于静态网站</br>
  通常，我们更倾向选择<BrowserRouter>，但如果你的网站仅用来呈现静态文件，那么<HashRouter>将会是一个好选择。</br>
  路由器组件无法接受两个及以上的子元素。基于这种限制的存在，创建一个<App>组件来渲染应用其余部分是一个有效的方法.

```jsx
import { BrowserRouter } from 'react-router-dom';

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
);

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'))
```

## 历史(History)
每个路由器都会创建一个history对象并用其保持追踪当前location并且在有变化时对网站进行重新渲染。这个history对象保证了React Router提供的其他组件的可用性，所以其他组件必须在router内部渲染。一个React Router组件如果向父级上追溯却找不到router组件，那么这个组件将无法正常工作。

## 路由(Route)
<Route>接受一个数为string类型的path，该值路由匹配的路径名的类型。例如：<Route path='/roster'/>会匹配以/roster开头的路径名。在当前path参数与当前location的路径相匹配时，路由就会开始渲染React元素。若不匹配，路由不会进行任何操作。

```jsx
<Route path='/roster'/>
// 当路径名为'/'时, path不匹配
// 当路径名为'/roster'或'/roster/2'时, path匹配
// 当你只想匹配'/roster'时，你需要使用"exact"参数
// 则路由仅匹配'/roster'而不会匹配'/roster/2'
<Route exact path='/roster'/>
```

## 路径(Path) & 匹配(match)
match 在组件函数的参数级别将被解构。
- path - (string) 用于匹配路径模式。用于构建嵌套的 <Route>
- url - (string) URL 匹配的部分。 用于构建嵌套的 <Link>
- isExact ：path 是否等于 pathname
- params ：从path-to-regexp获取的路径中取出的值都被包含在这个对象中

  使用[route tester](https://pshrmn.github.io/route-tester/#/)这款工具来对路由与URL进行检验。

## 嵌套路由(Switch)
## Link & NavLink
React Router提供了<Link>组件用来避免这种状况的发生。当你点击<Link>时，URL会更新，组件会被重新渲染，但是页面不会重新加载。
```jsx
//to = {pathname，search，hash, state}
<Link to={{ pathname: '/roster/7' }}>Player #7</Link>
```
NavLink 的不同在于可以给当前选中的路由添加样式,
比如上面写到的 activeStyle 和 activeClassName;

## withRouter
withRouter高阶组件，提供了history让你使用.</br>
引入withRouter之后,就可以使用编程式导航进行点击跳转, 需要注意的是export default的暴露如上面所写,如果结合redux使用,则暴露方式为: </br>withRouter(connect(...)(MyComponent))</br>
调用history的goBack方法会返回上一历史记录</br>
调用history的push方法会跳转到目标页,如上面goDetail方法</br>
跳转传参: push()可以接收一个对象参数,跳转之后,通过this.props.location.state接收
```js
export default withRouter(Header);
```
## 自定义路由/授权路由
```js
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path="/auth" component={UnauthorizedLayout} />
            <AuthorizedRoute path="/app" component={PrimaryLayout} />
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}
```
```js
class AuthorizedRoute extends React.Component {
  componentWillMount() {
    getLoggedUser()
  }

  render() {
    const { component: Component, pending, logged, ...rest } = this.props
    return (
      <Route {...rest} render={props => {
        if (pending) return <div>Loading...</div>
        return logged
          ? <Component {...this.props} />
          : <Redirect to="/auth/login" />
      }} />
    )
  }
}

const stateToProps = ({ loggedUserState }) => ({
  pending: loggedUserState.pending,
  logged: loggedUserState.logged
})

export default connect(stateToProps)(AuthorizedRoute)
```

## Code Splitting in React App


[AsyncComponent](https://github.com/AnomalyInnovations/serverless-stack-demo-client/tree/code-splitting-in-create-react-app)
[React-loadable](https://github.com/CodeLittlePrince/react-webapp-spa)



第一种方式[React Router v4 之代码分割](https://segmentfault.com/a/1190000011426329)
>封装async-component.js
>```js
>// async-component.js
>/**
> * 用于react router4 code splitting
> */
>import React, {Component} from 'react'
>
>/**
> * @param {Function} loadComponent e.g: () => import('./component')
> * @param {ReactNode} placeholder  未加载前的占位
> */
>export default (loadComponent, placeholder = null) => {
>  class AsyncComponent extends Component {
>    unmount = false
>
>    constructor() {
>      super()
>      this.state = {
>        component: null
>      }
>    }
>    componentWillUnmount() {
>      this.unmount = true
>    }
>    async componentDidMount() {
>      const {default: component} = await loadComponent()
>      if(this.unmount) return
>      this.setState({
>        component: component
>      })
>    }
>    render() {
>      const C = this.state.component
>
>      return (
>        C ? <C {...this.props}></C> : placeholder
>      )
>    }
>  }
>  return AsyncComponent
>}
>```
>使用
>```js
>import asyncComponent from './async-component'
>
>// 获取到异步组件
>const AsyncDemo = asyncComponent(() => import('./demo'))
>
>//...
>render() {
>  return (
>    <Route path="/demo" component={AsyncDemo}></Route>
>  )
>}
>```
第二种[React-Router 动态路由设计最佳实践](https://segmentfault.com/a/1190000011765141)
>封装一个高阶组件，用来实现将普通的组件转换成动态组件
>
>```js
>import React from 'react'
>
>const AsyncComponent = loadComponent => (
>  class AsyncComponent extends React.Component {
>    state = {
>      Component: null,
>    }
>
>    componentWillMount() {
>      if (this.hasLoadedComponent()) {
>        return;
>      }
>
>      loadComponent()
>        .then(module => module.default)
>        .then((Component) => {
>          this.setState({Component});
>        })
>        .catch((err) => {
>          console.error(`Cannot load component in <AsyncComponent />`);
>          throw err;
>        });
>    }
>
>    hasLoadedComponent() {
>      return this.state.Component !== null;
>    }
>
>    render() {
>      const {Component} = this.state;
>      return (Component) ? <Component {...this.props} /> : null;
>    }
>  }
>);
>
>export default AsyncComponent;
>```
>使用
>```js
>// 组件增强
>const Search = AsyncComponent(() => import("./containers/Search/Search"))
>
>// 路由调用
><Route location={location} path="/list" component={BookList} />
>```
第三种 [webpack v3 结合 react-router v4 做 dynamic import — 按需加载（懒加载）](https://segmentfault.com/a/1190000011128817)

[参考项目](https://github.com/CodeLittlePrince/react-webapp-spa)
```jsx
第一步：安装 babel-plugin-syntax-dynamic-import
babel用的是babel-env，使用方法可以去babel官方学习，实践可看我项目的源代码。

npm i -D babel-plugin-syntax-dynamic-import 以后， 在.babelrc文件的plungins中加上"syntax-dynamic-import"。

第二步：安装 react-loadable
npm i -S react-loadable 以后，我们就能愉快得做dynamic import了。

使用
const AsyncSearch = Loadable({
    loader: () => import('../containers/Search'),
    loading: MyLoadingComponent
});
```

---

## 相关连接
* [ReactTraining React-Router-Dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)
* [React-Router Guides](https://reacttraining.com/react-router/web/guides/quick-start)
* [Route-Test](https://pshrmn.github.io/route-tester/#/)
* [React Router v4 入坑指南](https://www.jianshu.com/p/6a45e2dfc9d9)

*[Code Splitting in Create React App](https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html)
* [code spliting vs](http://www.npmtrends.com/react-async-component-vs-react-loadable)
* [React-Router 动态路由设计最佳实践](https://segmentfault.com/a/1190000011765141)
* [webpack v3 结合 react-router v4 做 dynamic import — 按需加载（懒加载）](https://segmentfault.com/a/1190000011128817)
* [React Router v4 之代码分割](https://segmentfault.com/a/1190000011426329)
