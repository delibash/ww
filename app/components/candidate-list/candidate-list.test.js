import React from 'react';
import ReactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { role, candidates } from './data';
import CandidateCard from './index.js';

it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(
            <MemoryRouter>
            <CandidateCard
                candidates={candidates}
                role={role}
                activeCandidateId={12341234}
                uri="/role/123123123/123123123"
            />
            </MemoryRouter>, div);
});
