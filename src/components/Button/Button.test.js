import React from 'react'
import Button from "./Button"
import { render, screen, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer'

afterEach(cleanup);

test('render without crashing', () => {
    render(<Button label="click me please"></Button>)
});

test('render button correctly', () => {
    render(<Button label="click me please"></Button>)
    expect(screen.getByTestId('button')).toHaveTextContent("click me please")
})

test("renders button", () => {
    render(<Button label="save"></Button>)
    expect(screen.getByTestId('button')).toHaveTextContent("save")
})

test('matcher snapshot', ()=> {
    const tree = renderer.create(<Button label="save"></Button>).toJSON()
    expect(tree).toMatchSnapshot()
})