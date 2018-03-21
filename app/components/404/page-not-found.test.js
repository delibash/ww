import React from 'react';
import ReactDOM from 'react-dom';
import PageNotFound from './index';

it('handles math', () => {
  expect(1 + 1).toBe(2);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PageNotFound />, div);
});
