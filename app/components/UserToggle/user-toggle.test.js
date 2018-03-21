import React from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import UserToggle from './index.js';


it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(
            <MemoryRouter>
            <UserToggle
                isActive={ false }
                isLoggedIn={ false }
                handleLogin={ () => console.log("login!") }
                handleLogout={ () => console.log("login!") }
            />
            </MemoryRouter>, div);
});
