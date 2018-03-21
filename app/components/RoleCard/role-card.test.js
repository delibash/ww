import React from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import RoleCard from './index.js';
import role from './data.js';

it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(
            <MemoryRouter>
              <RoleCard  props={{role: [role]}}/>
            </MemoryRouter>, div);
});
