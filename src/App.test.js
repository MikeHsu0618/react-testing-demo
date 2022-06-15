import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// react-testing-library core api queries
// https://testing-library.com/docs/queries/byrole
// jest expect method api
// https://jestjs.io/docs/expect
test('renders 2 list items', () => {
  render(<App/>)
  const listitems = screen.getAllByRole('listitem')

  expect(listitems).toHaveLength(2)
  expect(listitems.length).toEqual(2)
  expect(listitems[0]).toHaveTextContent('apple')
  expect(listitems[1]).toHaveTextContent('banana')
})

test('render title', () => {
  render(<App></App>)
  const title = screen.getByTestId("testid")
  expect(title).toHaveTextContent("Hello World")
})