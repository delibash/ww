import React from 'react';
import ReactDom from 'react-dom';
import Search from './index';
import { applicants, roles } from './test-data.js';


it('renders', () => {
    const div = document.createElement('div');
    ReactDom.render(<Search searchString='search' roles={roles} applicants={applicants}/>, div);
});


it('sorts correctly', () => {
    const div = document.createElement('div');
    const search = ReactDom.render(<Search searchString='search' roles={roles} applicants={applicants}/>, div);
    const eBuilder = searchText => ({target: {value: searchText}});
    const rolesById = search.filterByType(roles, 17592186046183)('id');
    const rolesByTtitle = search.filterByType(roles, 'Full Stack Engineer')('title');
    const applicantsById = search.filterByType(applicants, 17592186050722)(['person','id']);
    const applicantsByName = search.filterByType(applicants, 'varun')(['person', 'full']);

    expect(applicantsById[0].person.full).toBe('Varun Koundinya');
    expect(rolesById[0].title).toBe('Data Analyst - Intern');
    expect(rolesByTtitle[0].title).toBe('Full Stack Engineer');
    expect(applicantsByName[0].person.id).toBe(17592186050722);
});
