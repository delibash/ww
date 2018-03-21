const addApplicants = (cache, roleId, applicants) => {
    const obj = {
        time: new Date().getTime(),
        data: applicants
    };
    const name = roleId.toString();
    const newApp = {};
    newApp[name] = obj;

    return {...cache, newApp};
}


const roleCacheReducer = (state = {}, {type, payload}={}) => {
    switch(type) {
        case "ADD_APPLICANTS":
            const { roleId, applicants } = payload;
            return addApplicants(state, roleId, applicants);
        default:
            return state;
    }
}

export default roleCacheReducer;
