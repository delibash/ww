import React from 'react';
import ReactDom from 'react-dom';
import { transcript, answers } from './mock-transcript.js';
import { MemoryRouter } from 'react-router-dom';
import Candidate from './index.js';

beforeAll(() => {
    window.fetch = (url, config) => {
        console.log(`calling: ${url}`);
        console.log(`with: ${config}`);
    }
})




it('renders while not loading', () => {
    const div = document.createElement('div');
    ReactDom.render( <Candidate
                       answers={[answers]}
                       transcript={[transcript]}
                       loaded={true}
                       candidateName={"test McTesterson"}
                     />, div);
})

it('renders loading screen when loading', () => {
    const div = document.createElement('div');
    ReactDom.render( <Candidate
                     answers={[answers]}
                     transcript={[transcript]}
                     loaded={false}
                     candidateName={"test McTesterson"}
                     />, div);
})
