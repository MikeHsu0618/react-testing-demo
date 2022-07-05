### Jest ResetMock example

```jsx
afterEach(() => {
  jest.resetAllMocks()
})
```

一個非常重要的觀念

<aside>
💡 為了正確的 mock，Jest 需要 `jest.mock('moduleName')` 與 `require` / `import` 陳述句在同一個 scope 內。

</aside>

# **覆蓋率報告**

- % Stmts (語句覆蓋率)程式碼中的每個語句是否皆有執行。
- % branch(分支覆蓋率)當程式碼中有分支時，例如 if-else，分支內容是否皆有執行。
- % Funcs(功能覆蓋率)程式碼中的每個功能是否皆有執行。
- % Lines(行覆蓋率)指的是程式碼文件中的每個可執行行，是否皆有執行。
- Uncovered Line #s未執行程式碼於檔案中的行數

### **[Jest：Manual Mocks](https://titangene.github.io/article/jest-manual-mocks.html)**

manual mock 是用於透過 mock 資料來對功能進行 stub out。例如：若你不想存取網站或 DB 之類的遠端資源，可能需要使用 fake data 來 manual mock 這些功能，以確保可以快速測試且不會出錯。

簡單來說可以把需要 mock 的 module 都在該 module 同一層的資料夾下新增一個 `__mocks__` 檔案，到時候只要在測試裡面 `jest.mock('./function')` 即可自動導出並且套用我們寫在 `__mocks__` 裡面的 `mock function` 。

使用到的套件或模組功能：

```jsx
// function.js
export const testfunction = () => console.log('testfunction1')

export const testfunction2 = () => console.log('testfunction2')
```

新增一個 mock 資料夾來覆蓋 `function.js` :

```jsx
// ./__mocks__/function.js
// 在同一層才能被自動辨認出來
export const testfunction = () => console.log('testfunctionMock1')

export const testfunction2 = () => console.log('testfunctionMock2')
```

主要測試檔案：

```jsx
// feat.test.js
import { testfunction } from './function'
jest.mock('./function')

it('should test', function () {
  testfunction() // testfunctionMock1
});
```

成功執行 mock function !

### 善用 debug()

debug() 是很好用的功能！

```jsx
import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {FavoriteNumber} from '../favorite-number'

test('renders a number input with a label "Favorite Number"', () => {
  render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  expect(input).toHaveAttribute('type', 'number')
})
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e8dbee45-3785-4ea4-9eb1-af0be6f96fc3/Untitled.png)

### 抓取 dom 元素的條件

`getByLabelText(/favorite number/i)` 其中的 `/../i` 為正則表達式，代表斜線中不分大小寫的字符都符合條件，這樣比單純用字串指定還要彈性。

```jsx
test('entering an invalid value shows an error message', () => {
  render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  userEvent.type(input, '10')
  expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})
```

### 觸發事件時可以考慮使用 『user-event』而不是『FireEvent』

可以把 `user-event` 當成是更高階 `fireEvent` ，其底層原理即是調用 `fireEvent` 並且做出一連串的判斷以及處理，更好的重現一個使用者的正常操作。

```jsx
import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FavoriteNumber} from '../favorite-number'

test('entering an invalid value shows an error message', () => {
  render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  userEvent.type(input, '10')
  expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})
```

```jsx

// user-event click 原始碼
https://github.com/testing-library/user-event/blob/5feaa942f46bb37d96c2f2fbeb4b33e8beff75ad/src/click.js#L94

--------

// 依照 dom 元素區分不同點擊事件
function click(element, init, {skipHover = false, clickCount = 0} = {}) {
  if (!skipHover) hover(element, init)
  switch (element.tagName) {
    case 'LABEL':
      clickLabel(element, init, {clickCount})
      break
    case 'INPUT':
      if (element.type === 'checkbox' || element.type === 'radio') {
        clickBooleanElement(element, init, {clickCount})
      } else {
        clickElement(element, init, {clickCount})
      }
      break
    default:
      clickElement(element, init, {clickCount})
  }
}

function clickBooleanElement(element, init, clickCount) {
  fireEvent.pointerDown(element, init)
  if (!element.disabled) {
    fireEvent.mouseDown(
      element,
      getMouseEventOptions('mousedown', init, clickCount),
    )
  }
  focus(element, init)
  fireEvent.pointerUp(element, init)
  if (!element.disabled) {
    fireEvent.mouseUp(
      element,
      getMouseEventOptions('mouseup', init, clickCount),
    )
    fireEvent.click(element, getMouseEventOptions('click', init, clickCount))
  }
}
```

### 使用 rerender 來更新 component props

`rerender` 函數可以讓我們重新渲染 `render` 出來的元素，並且我們可以重新傳遞 `props` 來驗證不同條件。

```jsx
import * as React from 'react'
import user from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'
import {FavoriteNumber} from '../favorite-number'

test('entering an invalid value shows an error message', () => {
  const {debug, rerender} = render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
  debug()
  rerender(<FavoriteNumber max={10} />)
  debug()
})
```

### 使用 queryByRole() 來驗證不存在的元素

一般我們最常使用到 `@testing-library/react` 的 get-prefix 函式來查找 dom 元素，像是 `getByRole` ，但如果想要查驗證一個 dom 元素是否不存在，使用 `getByRole` 將會因為得不到實際元素而報錯，這時我們可以使用另一個不會報錯的函式 `queryByRole` 。

```jsx
import * as React from 'react'
import user from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'
import {FavoriteNumber} from '../favorite-number'

test('entering an invalid value shows an error message', () => {
  const {rerender} = render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
  rerender(<FavoriteNumber max={10} />)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
```

### 使用 [jest-axe](https://github.com/nickcolley/jest-axe) 驗證 DOM 元素的可訪問性（a11y）

GDS 可訪問性團隊發現只有百分之三十的問題可以被自動化測試找出，而 `jest-axe` 就像是 `code-linters` (like `eslint` or `stylelint`) 可以找出一些常見問題，使我們從一開始就可以針對應用程式的可訪問性（a11y）把關，不必一再的追溯以及修復，但它不保證我們建構出來的內容就是可訪問的，因為他只能靜態分析，但他確實給了我們一個好的開始。

```jsx
import * as React from 'react'
import {render} from '@testing-library/react'
import {axe} from 'jest-axe'

function InaccessibleForm() {
  return (
    <form>
      <input placeholder="email" />
    </form>
  )
}

function AccessibleForm() {
  return (
    <form>
			// 如果一個 input 沒有配上一個 label 就是不符合 a11y
      <label htmlFor="username">Username</label>
      <input id="username" placeholder="username" />
    </form>
  )
}

test('inaccessible forms fail axe', async () => {
  const {container} = render(<InaccessibleForm />)
  try {
    expect(await axe(container)).toHaveNoViolations()
  } catch (error) {
    // NOTE: I can't think of a situation where you'd want to test that some HTML
    // actually _does_ have accessibility issues... This is only here for
    // demonstration purposes.
  }
})

test('accessible forms pass axe', async () => {
  const {container} = render(<AccessibleForm />)
  expect(await axe(container)).toHaveNoViolations()
})
```

<aside>
💡 我們必須用 `async await` 來處理 `axe()`驗證

</aside>

### 隱藏測試過程中合理的 `console.error logs`

在測試中我們可能會藉由 `throw error` 驗證錯誤條件，如此一來我們的訊息欄就會出現相關的錯誤消息，但我們在這情況下只關心的是測試有沒有順利通過，所以我們可以適當的將 `console.error` 的功能藉由 `jest.spyOn` 暫時關閉起來。

```jsx
// 將 console.error mock 成一個只會返回空物件的 function
beforeAll(() => {
	jest.spyOn(console, 'error').mockImpementation(() => {})
}

afterAll(()=> {
	console.error.mockRestore()
})
```

### 重複被檢驗的 `mockFunction` 需要注意是否有做 `mockClear()`

如果同一個 `jest.fn()` 被重複拿來驗證的話，其相關資訊將會繼續累計（例如 `toHaveBeenCalledTimes`），做多次驗證需要確保每次的 `jest.fn()` 都有被初始化。

```jsx
test('calls reportError and renders that there was a problem', () => {
  mockReportError.mockResolvedValueOnce({success: true})
  const {rerender} = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  rerender(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>,
  )

  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)

  expect(console.error).toHaveBeenCalledTimes(2)

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"There was a problem."`,
  )

  console.error.mockClear()
  mockReportError.mockClear()

  rerender(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  userEvent.click(screen.getByText(/try again/i))

	// 如果沒有 clear 的話，以下被 called 的次數將會繼續累計
  expect(mockReportError).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.queryByText(/try again/i)).not.toBeInTheDocument()
})
```

### 使用 `{wait} from ‘@testing-library/react’` 來等待畫面互動結束後的結果

假如我們使用了 `react-transition-group` 的特效，使元素在一秒鐘後才出現，這時我們必須使用 `async await` 加上 `wait` 函數來實現等待畫面互動結束後的結果。

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0be66e73-43a2-47fd-bbab-9e807a608ca4/Untitled.png)

### `render` 的第二個參數可以使結構更加簡化

`render` 的第二個參數可以內嵌許多資訊，使渲染出來的東西具備更多樣的效果，並且能將相關設定一起傳給 `rerender` ，使重新渲染時只需要修改必要的參數即可，使測試更簡潔。

```jsx
// 一般的寫法
const {rerender} = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )
rerender(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>,
  )

------

// 一開始就賦予設定的 render
const {rerender} = render(<Bomb />, {wrapper: ErrorBoundary})

rerender(<Bomb shouldThrow={true} />)
```

### 對 mock 的對象做出特別命名（nice to have）

對 mock 過的東西做特別命名可以提高測試的可讀性。

```jsx
import {loadGreeting as mockLoadGreeting} from '../api'

jest.mock('../api')

test('loads greetings on click', async () => {
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: testGreeting}})
	// ......略
})
```

### 使用 `msw` 套件運行測試 `API Server`

相較於對 `API function` mock，也可以選擇在測試環境中 run 起一個 `API Server` ，並寫上對應的 API 與回傳值，同樣可以達到切斷對第三方服務依賴的效果。

```jsx
import 'whatwg-fetch'
import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {GreetingLoader} from '../greeting-loader-01-mocking'

const server = setupServer(
  rest.post('/greeting', (req, res, ctx) => {
    return res(ctx.json({data: {greeting: `Hello ${req.body.subject}`}}))
  }),
)

beforeAll(() => server.listen({onUnhandledRequest: 'error'}))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
```

### 對 `react-router` mock

下面我們可以看到在我們在點擊了 `submitButton` 將會觸發原本的 `Redierect` ，這時我們只要簡單的將他 `jest.fn(()=> null)` 即可避免觸發轉導，之後可以對 `mockfunction` 接收的參數以及觸發次數來做驗證。

```jsx
jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

jest.mock('../api')

test('renders a form with title, content, tags, and a submit button', async () => {
  const fakeUser = {id: 'user-1'}
  render(<Editor user={fakeUser} />)

  userEvent.click(submitButton)

  await waitFor(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})
```

### 使用 `test-data-bot` 產生假資料

在測試中使用假資料產生工具，比起原先寫死的假資料，可以讓我們的測試更加彈性，並且避免人為錯誤。

```jsx
import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake, sequence} from 'test-data-bot'
import {Redirect as MockRedirect} from 'react-router'
import {savePost as mockSavePost} from '../api'
import {Editor} from '../post-editor-06-generate-data'

const postBuilder = build('Post').fields({
  title: fake((f) => f.lorem.words()),
  content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake((f) => [f.lorem.word(), f.lorem.word(), f.lorem.word()]),
})

const userBuilder = build('User').fields({
  id: sequence((s) => `user-${s}`),
})

test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()
  const fakeUser = userBuilder()
  render(<Editor user={fakeUser} />)
  const fakePost = postBuilder()
  const preDate = new Date().getTime()

  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  const submitButton = screen.getByText(/submit/i)

	// ....略
})
```

### 使用 `mockRejectedValueOnce` 來驗證 `Promise 的 Reject Callback`

```jsx
test('renders an error message from the server', async () => {
  const testError = 'test error'
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})
  const fakeUser = userBuilder()
  render(<Editor user={fakeUser} />)
  const submitButton = screen.getByText(/submit/i)

  userEvent.click(submitButton)

  const postError = await screen.findByRole('alert')
  expect(postError).toHaveTextContent(testError)
  expect(submitButton).toBeEnabled()
})
```

### 使用 `react-router-dom` 的 `BrowserRouter` 對 `react-router` 測試

首先我們必須讓測試環境知道我們現在的 `path history` ，才能初始化的渲染出我們設定的 router 組件。

```jsx
import * as React from 'react'
import {BrowserRouter} from 'react-router-dom'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Main} from '../main'

test('main renders about and home and I can navigate to those pages', () => {
  window.history.pushState({}, 'Test page', '/')
  render(
    <BrowserRouter>
      <Main />
    </BrowserRouter>,
  )
  expect(screen.getByRole('heading')).toHaveTextContent(/home/i)
  userEvent.click(screen.getByText(/about/i))
  expect(screen.getByRole('heading')).toHaveTextContent(/about/i)
})  
```

### 簡單測試 `Redux` 組件

基本：

```jsx
import * as React from 'react'
import {Provider} from 'react-redux'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Counter} from '../redux-counter'
import {store} from '../redux-store'

test('can render with redux with defaults', () => {
  render(
    <Provider store={store}>
      <Counter />
    </Provider>,
  )
  userEvent.click(screen.getByText('+'))
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('1')
})
```

客製初始值：

```jsx
import * as React from 'react'
import {Provider} from 'react-redux'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Counter} from '../redux-counter'
import {store} from '../redux-store'

test('can render with redux with custom initial state', () => {
  const store = createStore(reducer, {count: 3})
  render(
    <Provider store={store}>
      <Counter />
    </Provider>,
  )
  userEvent.click(screen.getByText('-'))
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('2')
})
```

<aside>
💡 所有重複的 `render` 邏輯都可以再被聚合到上一層來解藕

</aside>

### 簡單手動測試 `React Hooks`

如果直接呼叫 `useCounter` 系統會報錯表示不能在 component 以外的地方呼叫 `react hook` ，所以我們不依賴套件的話，需要將他簡單的丟進一個 `component function` 來取得 `hook(result)` 。

```jsx
import * as React from 'react'
import {render, act} from '@testing-library/react'
import {useCounter} from '../use-counter'

test('exposes the count and increment/decrement functions', () => {
  let result
  function TestComponent() {
    result = useCounter()
    return null
  }
  render(<TestComponent />)
  expect(result.count).toBe(0)
  act(() => result.increment())
  expect(result.count).toBe(1)
  act(() => result.decrement())
  expect(result.count).toBe(0)
})
```

### 使用 `@testing-library/react-hooks` 套件測試 `React Hooks`

初始化：

```jsx
import {renderHook, act} from '@testing-library/react-hooks'
import {useCounter} from '../use-counter'

test('exposes the count and increment/decrement functions', () => {
  const {result} = renderHook(useCounter)
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})
```

重新渲染：

可以使用 `renderHook` 返回的 `rerender` 重新渲染 hook。

```jsx
test('the step can be changed', () => {
  const {result, rerender} = renderHook(useCounter, {
    initialProps: {step: 3},
  })
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(3)
  rerender({step: 2})
  act(() => result.current.decrement())
  expect(result.current.count).toBe(1)
})
```

### 使用 `import {within} form '@testing-library/react` 限縮 `render` 完的元素

當我們使用 `react portal` 時，大部分的主要元件會渲染到主要的 `DOM tree` 之外，所以我們需要選擇到有包含到 `react portal` 的元素。

```jsx
import * as React from 'react'
import {render, within} from '@testing-library/react'
import {Modal} from '../modal'

test('modal shows the children', () => {
  render(
    <Modal>
      <div data-testid="test" />
    </Modal>,
  )
  const {getByTestId} = within(document.getElementById('modal-root'))
  expect(getByTestId('test')).toBeInTheDocument()
})

// ../modal.js
import * as React from 'react'
import ReactDOM from 'react-dom'

let modalRoot = document.getElementById('modal-root')
if (!modalRoot) {
  modalRoot = document.createElement('div')
  modalRoot.setAttribute('id', 'modal-root')
  document.body.appendChild(modalRoot)
}

// don't use this for your modals.
// you need to think about accessibility and styling.
// Look into: https://ui.reach.tech/dialog
function Modal({children}) {
  const el = React.useRef(document.createElement('div'))
  React.useLayoutEffect(() => {
    const currentEl = el.current
    modalRoot.appendChild(currentEl)
    return () => modalRoot.removeChild(currentEl)
  }, [])
  return ReactDOM.createPortal(children, el.current)
}

export {Modal}
```

### 使用 `unmount` 來測試元件消滅時是否有 `leaking memory`

如果我們沒有在下列範例中的 `umount` 後使用 `act(() => jest.runOnlyPendingTimers())` 的話，jest 將不會等待組件被銷毀後才開始驗證，故我們 `console.error` 噴錯得次數依然是 0。

[詳細用法](https://titangene.github.io/article/jest-timer-mocks.html)

```jsx
// countdown.js
import * as React from 'react'

function Countdown() {
  const [remainingTime, setRemainingTime] = React.useState(10000)
  const end = React.useRef(new Date().getTime() + remainingTime)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = end.current - new Date().getTime()
      if (newRemainingTime <= 0) {
        clearInterval(interval)
        setRemainingTime(0)
      } else {
        setRemainingTime(newRemainingTime)
      }
    })
    return () => clearInterval(interval)
  }, [])
  return remainingTime
}

export {Countdown}

// countdown.test.js
import * as React from 'react'
import {render, act} from '@testing-library/react'
import {Countdown} from '../countdown'

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

afterEach(() => {
  jest.clearAllMocks()
  jest.useRealTimers()
})

test('does not attempt to set state when unmounted (to prevent memory leaks)', () => {
  jest.useFakeTimers()
  const {unmount} = render(<Countdown />)
  unmount()
  act(() => jest.runOnlyPendingTimers())
  expect(console.error).not.toHaveBeenCalled()
})
```

### 在整合測試中，我們應該更多的使用 `findBy` 而不是 `getBy`

在整合測試中，我們會與多個組件以及元素『非同步』的互動，所以我們更應該使用的是回傳一個 `Promise` 的 `findBy 函式` 而不是一般的 `getBy 函式` 。

```jsx
import * as React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {submitForm as mockSubmitForm} from '../api'
import App from '../app'

jest.mock('../api')

test('Can fill out a form across multiple pages', async () => {
  mockSubmitForm.mockResolvedValueOnce({success: true})
  const testData = {food: 'test food', drink: 'test drink'}
  render(<App />)

  fireEvent.click(await screen.findByText(/fill.*form/i))

  fireEvent.change(await screen.findByLabelText(/food/i), {
    target: {value: testData.food},
  })
})
```

