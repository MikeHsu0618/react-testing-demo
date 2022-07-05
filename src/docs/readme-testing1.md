# 測試的藝術

## 寫測試前需要最好具備的基礎觀念

- OOP 物件導向
    1. ****抽象（Abstraction）****
    2. ****封裝（Encapsulation）****
    3. ****繼承（Inheritance）****
    4. ****多型（Polymorphism）****
- Solid 原則
    1. S = **Single-responsibility principle** **(SRP)** = 單一職責原則
    2. O = **Open–closed principle** **(OCP)** = 開放封閉原則
    3. L =**Liskov substitution principle** **(LSP)** = 里氏替換原則
    4. I = **Interface segregation principle** **(ISP)** = 介面隔離原則
    5. D = **Dependency inversion principle** **(DIP)** = 依賴反向原則

### 上述觀念可以幫助我們什麼？

單元測試讓你的程式更容易維護。原因在於你能夠對程式寫測試，代表你寫的程式的「使用說明書」清楚易懂。使用說明書很容易懂，就可以直接拿來用，減少重複的程式碼，符合 DRY (Don’t Repeat Yourself) 原則。

寫程式最大的成本在於維護，寫很簡單，但是要維護可就是個不容易的事情了。為了降低維護的成本，導入單元測試可以大大降低出錯的可能性，並且快樂地重構。

## **單元測試具有 FICC 特性(Fast, Isolated, Configuration-Free, Consistent)**

## **Fast**

執行速度快

## **Isolated**

即每個測試可以獨立執行，或是作為一組測試的一部分來執行，可以按照任何順序來執行。

## **Configuration-Free**

不需要額外進行外部的設定

## **Consistent**

產生穩定可靠的測試結果，包含通過和失敗

# **優秀的單元測試具備**

- 自動化
- 容易被實現
- 一段時間後還有存在意義(非臨時性)
- 任何人都可以按個按鈕就能執行它
- 執行速度快
- 執行結果一致
- 能完全掌控被測試的單元
- 完全被隔離(執行時獨立於其他測試)
- 執行失敗時，應該要很簡單的呈現問題的原因

## **3A**

- Arrange — 初始化
- Act — 行為，測試對象的執行過程
- Assert — 驗證結果

測試常聽到的 3A 原則，或許用 given, when, than(should) 來解釋，也是不錯

![https://miro.medium.com/max/1400/1*-Gsk-ek-jc-BLn3Fj6BtLg.png](https://miro.medium.com/max/1400/1*-Gsk-ek-jc-BLn3Fj6BtLg.png)

1. Given：對應到 Unit Testing 3A 中的 Arrange
2. When：對應到 Unit Testing 3A 中的 Act
3. Then：對應到 Unit Testing 3A 中的 Assert

## ****Unit Test 中的各種替身（Double）：Stub、Spy、Mock、Fake****

### ****為什麼要在程式中使用替身 Double 呢？****

隨著功能的越來越複雜，其中的牽連的依賴也會隨之增長，愈多的依賴代表越難實現的測試，所以我們可以善用各種替身是我們降低建立測試環境的複雜度，使用我們專注在我們想測試的實際邏輯上。

## Test ****Fake****

Test Fake 是讓功能實現的物件但跟正式環境的不一樣，通常他們比正式環境所需輸入物件更簡單，條件更單純。

```bash
// 此處我們 Fake 了一個 data 物件
jest.mock('axios', () => ({
    __esModule:true,
    default:{
        get: () => ({
            data: {
                id: 1,
                name: "John"
            }
        })
    }
}))
```

# **Test Spy**

Spy 用來驗證 SUT 與對其他依賴物件造成的 `任何效果`。例如今天我們在測試中新建了三個使用者，我們就可以派出我們的間諜朋友去刺探「是不是有三個使用者被新建了？」之類的預期結果。

```bash
const video = require('./video');

test('plays video', () => {
  const spy = jest.spyOn(video, 'play');
  const isPlaying = video.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);

  spy.mockRestore();
});
```

## Test Stub

Stub 為一個被預先定義好資訊用來當作在測試中的 response。在某些情況我們不希望服務被真的被觸發，只想要簡單的做出邏輯測試，這時我們可以使用 Stub 模擬一個該服務的回傳值。例如今天有一筆下單請求測試，我們在測試環境中不想要測試工具向資料真的下一筆單，我們只想要下單後取得的下單資訊單號，這是後我們就可以模擬出該回傳資訊以用來繼續完成我們剩餘的測試。

## Test Mock

Mock 的目的為「驗證目標物件與外部相依介面的互動方式」，驗證比起stub要複雜許多，變動性通常也會大一點，但往往在驗證一些void的行為會使用到，例如：在某個條件發生時，要記錄Log。這種情境，用stub就很難驗證，因為對目標物件來說，沒有回傳值，也沒有狀態變化，就只能透過mock object來驗證，目標物件是否正確的與Log介面進行互動。

```bash
import moduleName, {foo} from '../moduleName';

jest.mock('../moduleName', () => {
  return {
    __esModule: true,
    default: jest.fn(() => 42),
    foo: jest.fn(() => 43),
  };
});

// 我們 mock 了相關 function 得到我們預期的值
let res = moduleName(); // Will return 42
console.log(res) // 42
foo(); // Will return 43

// 驗證 mocked function 被執行的次數
test('direct', () => {
  expect(jest.mocked(foo).mock.calls).toHaveLength(2);
});
```

# React testing

## 單元測試（Unit Test）[](https://pjchender.dev/react/note-front-end-testing-intro/#%E5%96%AE%E5%85%83%E6%B8%AC%E8%A9%A6unit-test)

測試的對象會是程式碼中最小的單元，通常會是自己撰寫的函式（function）、方法（method）、類別（classes）等等，也就是你預期這個 input 進去後，應該會得到什麼樣的 output。舉例來說，根據 LeetCode 的題目寫出 function 後，LeetCode 就會對你寫的 function 做許多的驗證，確保你寫的 function 在各種情況下都能滿足題目的需求，而針對個別 function 進行測試的情況就是所謂的單元測試（Unit Test）。

這部分前端來說最常使到的工具是由 Facebook 推出的 [Jest](https://github.com/facebook/jest)；後端則很常使用 [mochajs](https://mochajs.org/) 搭配 [chai](https://github.com/chaijs/chai)。

## 整合測試（Integration Test）[](https://pjchender.dev/react/note-front-end-testing-intro/#%E6%95%B4%E5%90%88%E6%B8%AC%E8%A9%A6integration-test)

整合測試顧名思義就是需要「整合」，這表示測試的過程不是單一函式就能滿足，過程中可能會需要呼叫 API 獲取資料、使用其他的 library、或者和 DOM 進行整合，預期 DOM 上應該會呈現特定的 element。以 React Component 的測試來說，就比較接近這類型的測試，因為在 React Component 中，可能會去 fetch API 取得資料，取得資料後需要將資料呈現在 DOM 上。這時候如果是撰寫整合測試的話，就需要寫 mock data 取假設 API 回傳的資料內容，在取得內容後，檢測 DOM 有沒有如同預期的呈現出 element；這個過程中，也可以以程式的方式模擬使用者點擊、輸入內容的動作。

## 快照測試（Snapshot Testing）[](https://pjchender.dev/react/note-react-testing/#%E5%BF%AB%E7%85%A7%E6%B8%AC%E8%A9%A6snapshot-testing)

> Snapshot Testing @ JestReact Testing Done Right @ medium：有說明 test-renderer 和 shallow-renderer 的差異
>

Jest 提供了一個快照測試（snapshot testing），它會自動將元件產生一個文字版的快照，並儲存在硬碟上，每當 UI 改變時，就會收到通知，此時你可以檢視這個變更是不是預期的改變，是的話可以執行 `jest -u`，否則的話就去修復這個 bug。

## 點對點測試 (End-to-End (E2E) tests)[](https://pjchender.dev/react/note-front-end-testing-intro/#end-to-end-e2e-tests)

相較於 Unit Test 是測試單一邏輯、Integration Test 是測試整合多個邏輯下的情況、End-to-end (E2E) 則算是最模擬使用者操做實際產品的過程，透過 E2E Test，你可以撰寫使用者操作的流程，並可以透過一個瀏覽器的畫面實際看到頁面被操作的過程，你可以想像成就是有一個使用者真的打開了瀏覽器，從瀏覽器輸入網址，接著進入網頁後進行後續對應的流程。

這部分前端最常聽到的是 [cypress](https://www.cypress.io/) 或是 Google 推出的 [Puppeteer](https://github.com/puppeteer/puppeteer)。

### Testing Pyramid[](https://pjchender.dev/react/note-front-end-testing-intro/#testing-pyramid)

上面的這些概念可以整理成一個稱作「測試金三角（Testing Pyramid）」的圖示。三角形的越上方所需耗費的成本越高、執行的時間通常會更長，但卻更有機會找到意料之外的錯誤。