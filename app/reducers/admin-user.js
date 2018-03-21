const defState = {
    id: null,
    userName: '',
    password: null,
    organizationID: null,
    roles: [],
    firstName: '',
    lastName: '',
    active: true
};



const userReducer = (state = defState, {type, payload}={}) => {

    switch (type) {
        case "SET_USER_NAME":
            return {...state, userName: payload};
        case "SET_PASSWORD":
            return {...state, password: payload};
        case "SET_USER_COMPANY":
            return {...state, organizationID: payload};
        case "SET_USER_ROLES" :
            return {...state, roles: payload};
        case "ADD_USER_ROLE" :
            return {...state, roles: state.roles.concat([payload])};
        case "REMOVE_USER_ROLE" :
            return {...state, roles: state.roles.filter(r => r != payload)};
        case "SET_FIRST_NAME":
            return {...state, firstName: payload};
        case "SET_LAST_NAME":
            return {...state, lastName: payload};
        case "SET_STATUS":
            return {...state, active: payload};
        case "RESET_USER" :
            return defState;
        case "LOAD_USER" :
            return {...state, ...payload};
        default:
            return state;
    }
}

export default userReducer;
