const defState = {
    id: null,
    name: null,
    description: null,
    domain: null,
    accountManagerId: null,
    type: null
};



const companyReducer = (state = defState, {type, payload}={}) => {

  switch (type) {
    case "LOAD_COMPANY" :
      console.log("company payload: ", payload);
        return {...state, ...payload};
    case "RESET_COMPANY" :
        return defState;
    case "SET_COMPANY_NAME":
      return {...state, name: payload};
    case "SET_COMPANY_DESCRIPTION":
      return {...state, description: payload};
    case "SET_COMPANY_DOMAIN":
      return {...state, domain: payload};
    case "SET_COMPANY_TYPE" :
      return {...state, type: payload};
    case "SET_ACCOUNT_MANAGER" :
        return {...state, accountManagerId: payload};
    default:
      return state;
  }
}

export default companyReducer;
