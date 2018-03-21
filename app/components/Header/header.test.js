import React from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Header from './index.js';

beforeAll(() => {
    window.fetch = (url, config) => {
        console.log(`calling: ${url}`);
        console.log(`with: ${config}`);
    }
})

it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(
            <MemoryRouter>
              <Header> Logo Here </Header>
            </MemoryRouter>, div);
});
