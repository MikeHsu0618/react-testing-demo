import React from 'react'
import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import Login from './Login'
import axios from 'axios'

jest.mock('axios')

// jest.mock('axios', () => ({
//     __esModule:true,
//     default:{
//         get: () => ({
//             data: {
//                 id: 1,
//                 name: "John"
//             }
//         })
//     }
// }))

test("username input should be render", () => {
    render(<Login/>)
    const userInputEl = screen.getByPlaceholderText('username')
    expect(userInputEl).toBeInTheDocument()
})

test("password input should be render", () => {
    render(<Login/>)
    const passwordInputEl = screen.getByPlaceholderText('password')
    expect(passwordInputEl).toBeInTheDocument()
})

test("button should be render", () => {
    render(<Login/>)
    const buttonEl = screen.getByRole('button')
    expect(buttonEl).toBeInTheDocument()
})

test("username input should be empty", () => {
    render(<Login/>)
    const userInputEl = screen.getByPlaceholderText('username')
    expect(userInputEl.value).toBe("")
})

test("password input should be empty", () => {
    render(<Login/>)
    const passwordInputEl = screen.getByPlaceholderText('password')
    expect(passwordInputEl.value).toBe("")
})

test("button should be disable", () => {
    render(<Login/>)
    const buttonEl = screen.getByRole('button')
    expect(buttonEl).toBeDisabled()
})

test("loading should not be rendered", () => {
    render(<Login/>)
    const buttonEl = screen.getByRole('button')
    expect(buttonEl).not.toHaveTextContent('please wait')
})


test("error massage should not be visible", () => {
    render(<Login/>)
    const ErrorEl = screen.getByTestId('error')
    expect(ErrorEl).not.toBeVisible()
})

test("username input should change", () => {
    render(<Login/>)
    const userInputEl = screen.getByPlaceholderText('username')
    const testValue = "test";
    fireEvent.change(userInputEl, {target: {value: testValue}})
    expect(userInputEl.value).toBe(testValue)
})

test("password input should change", () => {
    render(<Login/>)
    const passwordInputEl = screen.getByPlaceholderText('password')
    const testValue = "test";
    fireEvent.change(passwordInputEl, {target: {value: testValue}})
    expect(passwordInputEl.value).toBe(testValue)
})

test("button should not be disable when input exists", () => {
    render(<Login/>)
    const buttonEl = screen.getByRole('button')
    const passwordInputEl = screen.getByPlaceholderText('password')
    const userInputEl = screen.getByPlaceholderText('username')

    const testValue = "test";
    fireEvent.change(passwordInputEl, {target: {value: testValue}})
    fireEvent.change(userInputEl, {target: {value: testValue}})

    expect(buttonEl).not.toBeDisabled()
})

test("loading should be rendered when clicked", () => {
    render(<Login/>)
    const buttonEl = screen.getByRole('button')
    const passwordInputEl = screen.getByPlaceholderText('password')
    const userInputEl = screen.getByPlaceholderText('username')

    axios.get = jest.fn().mockImplementation(()=> ({data: {id: 1, name: 'John'}}))

    const testValue = "test";
    fireEvent.change(passwordInputEl, {target: {value: testValue}})
    fireEvent.change(userInputEl, {target: {value: testValue}})
    fireEvent.click(buttonEl);
    expect(buttonEl).toHaveTextContent('please wait')
})

test("loading should not be rendered after fetching", async () => {
    render(<Login/>)
    const buttonEl = screen.getByRole('button')
    const passwordInputEl = screen.getByPlaceholderText('password')
    const userInputEl = screen.getByPlaceholderText('username')

    const testValue = "test";
    fireEvent.change(passwordInputEl, {target: {value: testValue}})
    fireEvent.change(userInputEl, {target: {value: testValue}})
    fireEvent.click(buttonEl);
    await waitFor(() => expect(buttonEl).not.toHaveTextContent('please wait'))
})

test("user should not be rendered after fetching", async () => {
    // 渲染元件
    render(<Login/>)
    // 捕捉元素
    const buttonEl = screen.getByRole('button')
    const passwordInputEl = screen.getByPlaceholderText('password')
    const userInputEl = screen.getByPlaceholderText('username')

    // mock api
    const mockGet = jest.fn()
    axios.get = mockGet.mockImplementation(()=> ({data: {id: 1, name: 'John'}}))
    // axios.get = jest.fn().mockReturnValue({data: {id: 1, name: 'John'}})
    // axios.get = jest.fn().mockReturnValueOnce({data: {id: 1, name: 'John'}})

    // 建立假資料
    const testValue = "test";
    // 執行程式
    fireEvent.change(passwordInputEl, {target: {value: testValue}})
    fireEvent.change(userInputEl, {target: {value: testValue}})
    fireEvent.click(buttonEl);

    // 驗證結果
    expect(mockGet.mock.calls.length).toEqual(1)
    const userItem = await screen.findByText("John")
    expect(userItem).toBeInTheDocument()
})

const sum = (a, b) => {
    if (typeof a != "number" || typeof b != "number") {
        return null
    }
    return  a + b
}

describe("unit testing", () => {
    test("function sum should be fine", () => {
        // 建立假資料
        let num1 = 10
        let num2 = 20
        // 執行程式
        let res = sum(num1, num2)
        // 驗證結果
        expect(res).toEqual(30)

        // 更多的邊緣測試
        expect(sum("10", num2)).toEqual(null)
    })
})

