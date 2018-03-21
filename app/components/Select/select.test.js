import React from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Select from './index.js';

const options = [{value: 1, label: "one"}, {value: 2, label: "two"}];

it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(
            <MemoryRouter>
            <Select
              propType="test"
              options={options}
              handleChange={() => console.log("selected!")}
            />
            </MemoryRouter>, div);
});
