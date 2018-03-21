import React from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import CandidateCard from './index.js';


it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(
            <MemoryRouter>
            <CandidateCard
               name="test"
               email="test@wadeandwendy.ai"
               atsId="12341234"
            />
            </MemoryRouter>, div);
});
