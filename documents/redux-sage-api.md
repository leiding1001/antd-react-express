<font size=2>

<!-- TOC -->

- [API 参考](#api-参考)
  - [Middleware API](#middleware-api)
    - [createSageMiddleware(...sagas)](#createsagemiddlewaresagas)
    - [middleware.run(saga, ...args)](#middlewarerunsaga-args)
  - [Saga Helpers](#saga-helpers)
    - [takeEvery(pattern, saga, ...args)](#takeeverypattern-saga-args)
    - [takeLatest(pattern, saga, ...args)](#takelatestpattern-saga-args)
  - [Effect creators](#effect-creators)
    - [take(pattern)](#takepattern)
    - [put(action)](#putaction)
    - [call(fn, ...args)](#callfn-args)
    - [call([context, fn], ...args)](#callcontext-fn-args)
    - [apply(context, fn, args)](#applycontext-fn-args)
    - [cps(fn, ...args)](#cpsfn-args)
    - [cps([context, fn], ...args)](#cpscontext-fn-args)
    - [fork(fn, ...args)](#forkfn-args)
    - [fork([context, fn], ...args)](#forkcontext-fn-args)
    - [join(task)](#jointask)
    - [cancel(task)](#canceltask)
    - [select(selector, ...args)](#selectselector-args)
  - [Effect combinators](#effect-combinators)
    - [race(effects)](#raceeffects)
    - [[...effects] (并行的 effects)](#effects-并行的-effects)
  - [Interfaces](#interfaces)
  - [External API](#external-api)

<!-- /TOC -->

#API 参考

## Middleware API

### createSageMiddleware(...sagas)
创建一个Redux中间件，将Sagas与 Redux store 建立连接
* sagas: Array - Generator 函数列表

例子
```js
import createSagaMiddleware from 'redux-saga'
import reducer from './path/to/reducer'
import sagas from './path/to/sagas'

export default function configureStore(initialState) {

  return createStore(
    reducer,
    initialState,
    applyMiddleware(,createSagaMiddleware(..sagas))
  )
}
```

注意事项：
`sagas` 中的么个Generator函数被调用时，都会被传入Redux store的getState方法作为第一个参数。
`sagas` 中的每个函数都必须返回一个Generator对象。middleware 会迭代这个 Generator并执行所有 yield 后面的 Effect。(Effect 可以看做redux-saga的任务单元)。

在第一次迭代里，middleware 会调用 next() 方法以取得下一个 Effect。然后middleware会通过下面提到的 Effect API 来执行 yield 后的 Effect。 与此同时，Generator会暂停，直到 Effect执行结束。当接受到执行的结果，middleware在Generator里接着调用next(result), 并将得到的结果作为参数传入。这个过程会一直重复，直到Generator 正常或通过跑出一些错误结束。

如果执行引发了一个错误，就会调用Generator的throw(Error) 方法来替代。

### middleware.run(saga, ...args)
动态执行 saga。用于 applyMiddleware 阶段之后执行 Sagas。

当你创建一个 middleware 实例：
```js
import createSagaMiddleware from 'redux-saga'
import startupSagas from './path/to/sagas'

// middleware 实例
const sagaMiddleware = createSagaMiddleware(...startupSagas)
```

## Saga Helpers

### takeEvery(pattern, saga, ...args)
在发起的 action 与 pattern 匹配时派生指定的 saga。

每次发起一个 action 到 Store，并且这个 action 与 pattern 相匹配，那么 takeEvery 将会在后台启动一个新的 saga 任务。

例子
在以下的例子中，我们创建了一个简单的任务 fetchUser。在每次 USER_REQUESTED action 被发起时，使用 takeEvery 来启动一个新的 fetchUser 任务。

```js
import { takeEvery } from `redux-saga`

function* fetchUser(action) {
  ...
}

function* watchFetchUser() {
  yield* takeEvery('USER_REQUESTED', fetchUser)
}
```
注意事项
takeEvery 是一个高阶 API，使用 take 和 fork 构建。下面演示了这个辅助函数是如何实现的：
```js
function* takeEvery(pattern, saga, ...args) {
  while(true) {
    const action = yield take(pattern)
    yield fork(saga, ...args.concat(action))
  }
}
```

takeEvery 不会对多个任务的响应返回进行排序，并且也无法保证任务将会按照启动的顺序结束。如果要对响应进行排序，可以关注以下的 takeLatest。

### takeLatest(pattern, saga, ...args)

在发起的 action 与 pattern 匹配时派生指定的 saga。并且自动取消之前启动的所有 saga 任务（如果在执行中）。

每次发起一个 action 到 Store，并且这个 action 与 pattern 相匹配，那么 takeLatest 将会在后台启动一个新的 saga 任务。 如果之前已经有一个 saga 任务启动了（当前 action 之前的最后发起的 action），并且这个任务在执行中，那这个任务将被取消， 并抛出一个 SagaCancellationException 错误。

例子
在以下的例子中，我们创建了一个简单的任务 fetchUser。在每次 USER_REQUESTED action 被发起时，使用 takeLatest 来启动一个新的 fetchUser 任务。 由于 takeLatest 取消了所有之前启动的未完成的任务，这样就可以保证：如果用户以极快的速度连续多次触发 USER_REQUESTED action，将会以最后的那个结束。

```js
import { takeLatest } from `redux-saga`

function* fetchUser(action) {
  ...
}

function* watchLastFetchUser() {
  yield* takeLatest('USER_REQUESTED', fetchUser)
}
```
注意事项

takeLatest 是一个高阶 API，使用 take 和 fork 构建。下面演示了这个辅助函数是如何实现的：
```js
function* takeLatest(pattern, saga, ...args) {
  let lastTask
  while(true) {
    const action = yield take(pattern)
    if(lastTask)
      yield cancel(lastTask) // 如果任务已经终止，取消就是空操作

    lastTask = yield fork(saga, ...args.concat(action))
  }
}
```

## Effect creators
>注意
>
>以下每个函数都会返回一个 plain Javascript object (纯文本 Javascript 对象) 并且不>会执行任何其它的操作。 执行是由 middleware 在上述迭代过程中进行的。 middleware 检查>每个 Effect 的信息，并进行相应的操作。


### take(pattern)
创建一个 Effect 描述信息， 指示 middleware 等待 Store 上指定的Action。Generator会暂停，直到一个与pattern 匹配的action 被发起。

用以下规则来解释 pattern：
* 如果调用 take 时参数为空，或者传入 '*'，那将会匹配所有发起的 action（例如，take() 会匹配所有的 action）。
* 如果是一个函数，action 会在 pattern(action) 返回为 true 时被匹配（例如，take(action => action.entities) 会匹配那些 entities 字段为真的 action）。
* 如果是一个字符串，action 会在 action.type === pattern 时被匹配（例如，take(INCREMENT_ASYNC)
* 如果参数是一个数组，会针对数组所有项，匹配与 action.type 相等的 action（例如，take([INCREMENT, DECREMENT]) 会匹配 INCREMENT 或 DECREMENT 类型的 action）。

### put(action)
创建一条 Effect 描述信息，指示 middleware 发起一个 action 到 Store。
action: Object - [完整信息可查看 Redux 的 dispatch 文档](http://redux.js.org/docs/api/Store.html#dispatch)

>注意
>
>put 执行是异步的。即作为一个单独的 microtask，因此不会立即发生。

### call(fn, ...args)
创建一条 Effect 描述信息，指示 middleware 调用 fn 函数并以 args 为参数。
* fn: Function - 一个 Generator 函数, 或者返回 Promise 的普通函数
* args: Array - 一个数组，作为 fn 的参数

>注意
>
>fn 既可以是一个普通函数，也可以是一个 Generator 函数。
>middleware 调用这个函数并检查它的结果。
>如果结果是一个 Generator 对象，middleware 会执行它，就像在启动 Generator （startup >Generators，启动时被传给 middleware）时做的。 如果有子级 Generator，那么在子级 Generator 
>正常结束前，父级 Generator 会暂停，这种情况下，父级 Generator 将会在子级 Generator 
>返回后继续执行，或者直到子级 Generator 被某些错误中止， 如果是这种情况，将在父级 Generator
>中抛出一个错误。
>
>如果结果是一个 Promise，middleware 会暂停直到这个 Promise 被 resolve，resolve 后 
>Generator 会继续执行。 或者直到 Promise 被 reject 了，如果是这种情况，将在 Generator 
>中抛出一个错误。
>
>当 Generator 中抛出了一个错误，如果有一个 try/catch 包裹当前的 yield 指令，控制权将被转
>交给 catch。 否则，Generator 会被错误中止，并且如果这个 Generator 被其他 Generator 
>调用了，错误将会传到调用的 Generator。

### call([context, fn], ...args)
类似 call(fn, ...args)，但支持为 fn 指定 this 上下文。用于调用对象的方法。

### apply(context, fn, args)
类似 call([context, fn], ...args)

### cps(fn, ...args)
创建一条 Effect 描述信息，指示 middleware 以 Node 风格调用 fn 函数。
* fn: Function - 一个 Node 风格的函数。即不仅接受它自己的参数，fn 结束后会调用一个附加的回调函数。回调函数接受两个参数，第一个参数是报错信息，第二个是成功的结果。
* args: Array - 一个数组，作为 fn 的参数

>注意
>
>middleware 将执行 fn(...arg, cb)。cb 是被 middleware 传给 fn 的回调函数。
>如果 fn 正常结束，会调用 cb(null, result) 通知 middleware 成功了。 
>如果 fn 遇到了某些错误，会调用 cb(error) 通知 middleware 出错了。
>fn 结束之前 middleware 会保持暂停状态。

### cps([context, fn], ...args)
支持为 fn 指定 this 上下文（调用对象方法）。

### fork(fn, ...args)
创建一条 Effect 描述信息，指示 middleware 以 无阻塞调用 方式执行 fn。

参数
* fn: Function - 一个 Generator 函数, 或者返回 Promise 的普通函数
* args: Array - 一个数组，作为 fn 的参数

注意

fork 类似于 call，可以用来调用普通函数和 Generator 函数。但 fork 的调用时无堵塞的，
在等待fn返回结果时，middleware 不会暂停 Generator。相反，一旦 fn 被调用， Generator
立即恢复执行。

fork 与 race 类似， 是一个中心化的 Effect，管理 Sagas 间的并发。

yield fork(fn, ...args) 的结果是一个Task对象 -- 一个具备某些有用的方法和属性的对象。

### fork([context, fn], ...args)
支持为 fn 指定 this 上下文（调用对象方法）。

### join(task)
创建一条 Effect 描述信息，指示 middleware 等待之前的 fork 任务返回结果。
* task: Task - 之前的 fork 指令返回的 Task 对象

### cancel(task)
创建一条 Effect 描述信息，指示 middleware 取消之前的 fork 任务。

* task: Task - 之前的 fork 指令返回的 Task 对象

### select(selector, ...args)

创建一条 Effect 描述信息，指示 middleware 调用提供的选择器获取 Store state 上的数据（例如，返回 selector(getState(), ...args) 的结果）。

* selector: Function - 一个 (state, ...args) => args 函数. 通过当前 state 和一些可选参数，返回当前 Store state 上的部分数据。
* args: Array - 可选参数，传递给选择器（附加在 getState 后）

如果 select 调用时参数为空（即 yield select()），那 effect 会取得整个的 state（和调用 getState() 的结果一样）。
>注意
>
>Saga 最好是自主独立的，不应依赖 Store 的 state。这使得很容易修改 state 实现部分而不影响 Saga 代码。 Saga 最好只依赖它自己内部的控制 state，并尽可能这样做。但有时，我们可能会发现在 Saga 中查询 state 而不是自行维护所需的数据，会更加方便（比如，当一个 Saga 重复调用 reducer 的逻辑，来计算那些已经被 Store 计算的 state）。

```js
export const getCart = state => state.cart

function* checkout() {
  // 使用选择器查询 state
  const cart = yield select(getCart)

  // ... 调用某些 Api 然后发起一个 success/error action
}

export default function* rootSaga() {
  while(true) {
    yield take('CHECKOUT_REQUEST')

    // 不再需要传递 getState 参数了
    yield fork(checkout)
  }
}
```

## Effect combinators

### race(effects)
创建一条 Effect 描述信息，指示 middleware 在多个 Effect 之间执行一个 race（类似 Promise.race([...]) 的行为）。

>注意
>
>在 resolve race 的时候，middleware 会自动取消所有失效的 Effect（译注：即剩余的 Effect）。

### [...effects] (并行的 effects)
创建一条 Effect 描述信息，指示 middleware 并行执行多个 Effect，并等待所有 Effect 完成。

例子

以下的例子并行执行了 2 个阻塞调用：
```js
import { fetchCustomers, fetchProducts } from './path/to/api'

function* mySaga() {
  const [customers, products] = yield [
    call(fetchCustomers),
    call(fetchProducts)
  ]
}

```

注意

并行执行多个 Effect 时，middleware 会暂停 Generator，直到以下情况之一：
* 所有 Effect 成功完成：Generator 恢复并返回一个包含所有 Effect 结果的数组。
* 在所有 Effect 完成之前，有一个 Effect 被 reject 了：Generator 抛出 reject 错误。

## Interfaces
Task
Task 接口指定了通过 fork，middleware.run 或 runSaga 执行 Saga 的结果。


## External API
