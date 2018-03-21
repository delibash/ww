import React from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { LoginTest } from './index.js';

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
              <LoginTest/>
            </MemoryRouter>, div);
});
