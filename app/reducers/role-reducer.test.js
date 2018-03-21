import reducer from './role-details-reducer.js';

const _ = undefined;
it('should return deffState', () => {
    reducer();
})

it('should load a new role', () => {
    const newRole = reducer(_, {type: 'LOAD_ROLE_SUCESS', payload: {
        id: 12341234,
        location: 'here',
        recruiter: 'dave',
        title: 'Test Role',
        candidates:[],
        loading: false,
        error: false,
        activeCandidate: {
            person : {
                id: 12341234,
                full: 'John Smith'
            }
        }
    }});

    expect(newRole.title).toBe('Test Role');
    expect(newRole.activeCandidate['12341234'].person.full).toBe('John Smith');
})

it('should set error on failure', () => {
    const errorObj = reducer(_, {type: 'LOAD_ROLE_FAILURE', payload: 'ERROR!!'});
    expect(errorObj.error).toBe('ERROR!!');
});

it('loading new roles/candidates should not overwrite candidate cache', () => {
    const firstRole = reducer(_, {type: 'LOAD_ROLE_SUCESS', payload: {
        id: 12341234,
        location: 'here',
        recruiter: 'dave',
        title: 'Test Role',
        candidates:[],
        loading: false,
        error: false,
        activeCandidate: {
            person : {
                id: 12341234,
                full: 'John Smith'
            }
        }
    }});
    const secondRole = reducer(firstRole, {type: 'LOAD_ROLE_SUCESS', payload: {
        id: 12341234,
        location: 'here',
        recruiter: 'dave',
        title: 'Test Role',
        candidates:[],
        loading: false,
        error: false,
        activeCandidate: {
            person : {
                id: 1234512345,
                full: 'Jane Doe'
            }
        }
    }});
    expect(secondRole.activeCandidate['12341234'].person.full).toBe('John Smith');
    expect(secondRole.activeCandidate['1234512345'].person.full).toBe('Jane Doe');
});
