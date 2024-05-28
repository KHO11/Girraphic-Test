import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('download CSV file button showing', () => {
  render(<App />);
  const button = screen.getByRole('button', {name: 'Download CSV'});
  expect(button).toBeInTheDocument()
});

test('table showing the race results', () => {
  render(<App />);
  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument()
});

test('button click event export CSV', () => {
  const { container } = render(<App />);
  fireEvent.click(container.querySelector('.bottomButton'));
});

test('click event for sorting rank or bibnumber', () => {
  const { container } = render(<App />);
  fireEvent.click(container.querySelector('.up-arrow'));
});