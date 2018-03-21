const defState = {
    id: null,
    jobTitle: '',
    unparsedLocation: '',
    department: '',
    description: '',
    orgId: null,
    questions: [],
    assignees: [],
    type: ''
};



const adminRoleReducer = (state = defState, {type, payload}={}) => {

    switch (type) {
        case "SET_ROLE_TITLE":
            return {...state, jobTitle: payload};
        case "SET_LOCATION":
            return {...state, unparsedLocation: payload};
        case "SET_DEPARTMENT":
            return {...state, department: payload};
        case "SET_ROLE_DESCRIPTION" :
            return {...state, description: payload};
        case "SET_ROLE_COMPANY":
            return {...state, orgId: payload};
        case "SET_ROLE_ASSIGNEES":
            return {...state, assignees: payload || []};
        case "ADD_ROLE_ASSIGNEE":
            return {...state, assignees: state.assignees.concat([payload])};
        case "REMOVE_ROLE_ASSIGNEE" :
            return {...state, assignees: state.assignees.filter(v => v!= payload)};
        case "RESET_ROLE" :
            return defState;
        case "LOAD_ADMIN_ROLE" :
            return {...state, ...payload};
        default:
            return state;
    }
}

export default adminRoleReducer;
