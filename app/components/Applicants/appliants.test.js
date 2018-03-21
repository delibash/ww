import React from 'react';
import ReactDom from 'react-dom';
import Applicants from './index.js';
import role from './data.js';
import { MemoryRouter } from 'react-router-dom';

it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(
            <MemoryRouter>
                <Applicants
                  role={role}
                  handleChange={() => console.log("candidate clicked")}
                />
            </MemoryRouter>,div);
});
