import React from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import RoleList from './index.js';
import { roles, activeRoleId } from './data.js';

it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(
            <MemoryRouter>
            <RoleList  roles={ roles } activeRoleId={activeRoleId}/>
            </MemoryRouter>, div);
});
