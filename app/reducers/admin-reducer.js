const defState = {
    roles: [],
    companies: [],
    users: []
};

const adminReducer = (state = defState, {type, payload}={}) => {

  switch (type) {
    case "LOAD_ROLES_SUCCESS":
      const defRole = { jobTitle: '-', id: '-', location: '-', status: 'Active', company: '-' };
      const roles = payload
                .map(r => ({location: r.unparsedLocation, company: r.orgName, ...r}))
                .map( r => ({...defRole, ...r}))
      return {...state, roles : roles};
    case "LOAD_COMPANIES_SUCCESS":
      const defOrg = { name: '-', id: '-', type: '-', domain: '-' };
      const companies = payload
                .map(c => ({name: c.name, id: c.id, domain: c.domain}))
                .map(c => ({...defOrg, ...c}));
      return {...state, companies};
    case "LOAD_USERS_SUCCESS":
      const defUser = { name: '-', email: '-', company: '-', roles: '-', digest: '-', status: 'Active' };
      const users = payload
                .map(u => ({name: u.firstName || u.lastName ? `${u.firstName} ${u.lastName}` : '-',
                            email: u.userName,
                            company: u.orgName || '-',
                            status: u.active === false ? 'Inactive' : 'Active',
                            ...u}))
                .map(u => ({...defUser, ...u}));
      return {...state, users};
    default:
      return state;
  }
}

export default adminReducer;
