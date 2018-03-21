const baseUrl = API_URL;

const uniqueApplicants = arr => {
    const newArr = arr.reduce((memo, value, arr) => {
        if(memo.map(obj => obj.person.id).indexOf(value.person.id) === -1) {
            return memo.concat(value);
        } else return memo;
    }, []);
    return newArr;
};

const passThroughLogger = label => {
  return (data) => {
    console.log(label, data);
    return data;
  }
}

const getRoles = (uri, fetcher) => {
    return fetcher(`${uri}/api/v1/roles`, { credentials: 'include' })
        .then(res => res.json())
        .catch(passThroughLogger('error getting roles: '));
}

const getApplicants = (uri, fetcher, roleId) => {
    const url = roleId ? `${uri}/api/v1/applicants?role=${roleId}` : `${uri}/api/v1/applicants`;
    return fetcher(url, { credentials: 'include' })
        .then(res => res.json());
}
const getInitialData = (uri, fetcher, roleId)  => {
    const roles = fetcher(`${uri}/api/v1/roles`, { credentials: 'include' })
              .then(res => res.json());

    return roles
        .then(roles => {
            const parsedRoles = roles.map( role => ({
                id: role.id ? role.id : 'No Role ID',
                title: role.jobTitle ? role.jobTitle : 'No Role Title',
                fieldType: role.fieldType ? role.fieldType : 0,
                location: role.unparsedLocation ? role.unparsedLocation : 'No Location',
                recruiter: role.recruiter ? role.recruiter : 'No Recruiter',
                numCandidates: role.numApplicants ? role.numApplicants : 0,
                candidates: []
            }));
            const [role] = roleId ? parsedRoles.filter(role => role.id === roleId) : parsedRoles;
            return { role, roles: parsedRoles, applicants: [] };
        })
        .catch(passThroughLogger("error getting initial data: "));
}

const getRoleInfo =(uri, fetcher, roleId) => {
    return fetcher(`${uri}/api/v1/role/${roleId}/with-applicants`, { credentials: 'include' })
    .then(res => res.json())
    .catch(passThroughLogger('error getting role info: '));
}

const getSession = (uri, fetcher) => {
  return fetcher(`${uri}/session`, { credentials: 'include'})
    .then(res => res.json())
    .catch(err => console.log("error getting session: ", err));
}

const login = (uri, fetcher, credentialsObject) => {
  const req = new Request(`${uri}/login`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: new Headers({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Cache": "no-cache"
    }),
    "body": JSON.stringify(credentialsObject)
  });

  return fetcher(req)
    .then(res => res.json())
    .then(passThroughLogger('res: '))
    .then(res => {
        if(window.FS) {
            window.FS.identify(res.id,
                        { displayName: res.userName,
                            orgId: res.organizationID
                        });
        }
        if(window.mixpanel) {
            window.mixpanel.track("Signed In");
        }

        return res;
    })
    .catch(passThroughLogger('error logging in: '));
}

const loginDigest = (uri, fetcher, digest) => {
    const req = new Request(`${uri}/login-query?digest=${digest}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cache": "no-cache"
        })
    });

    return fetcher(req)
        .then(res => res.json())
        .catch(passThroughLogger('eror logging in: '));
}

const getApplicant = (uri, fetcher, roleId, applicantId) => {
  return fetcher(`${uri}/api/v1/roles/${roleId}/candidates/${applicantId}`, { credentials: 'include' })
    .then(res => res.json())
    .catch(passThroughLogger('error getting applicant: '));
}

const logout = (uri, fetcher) => {
  return fetcher(`${uri}/logout`, { credentials: 'include', method: 'POST' })
    .catch(passThroughLogger('error logging out: '));
}

const getUsers = (uri, fetcher) => {
    return fetcher(`${uri}/user/management/users`, { credentials: 'include' })
        .then(res => res.json())
        .catch(passThroughLogger('error fetching users: '));
}

const getCompanies = (uri, fetcher) => {
    return fetcher(`${uri}/api/v1/org/all`, { credentials: 'include' })
        .then(res => res.json())
        .catch(passThroughLogger('error getting orgs: '))
}

const getAdminData = (uri, fetcher) => {
    const roles = getRoles(uri, fetcher);
    const users = getUsers(uri, fetcher);
    const companies = getCompanies(uri, fetcher);

    return Promise.all([roles, users, companies])
        .catch(passThroughLogger('error getting admin data: '));
}

const createUser = (uri, fetcher, userObj) => {
    return fetcher(`${uri}/user/management/new`, {credentials: 'include', body: JSON.stringify(userObj), method: 'POST'})
        .then(res => res.json())
        .catch(passThroughLogger('error saving user: '));
}

const getUser = (uri, fetcher, userId) => {
    const url = userId ? `${uri}/user/management/${userId}` : `${uri}/user/`;
    return fetcher(url, { credentials: 'include' })
        .then(res => res.json())
        .catch(passThroughLogger('error getting user'));
}

const updateUser = (uri, fetcher, userId, userObj) => {
    return fetcher(`${uri}/user/management/${userId}`, {credentials: 'include', body: JSON.stringify(userObj), method: 'POST'})
        .then(res => res.json())
        .catch(passThroughLogger('error saving user: '));
}

const updateCurrentUser = (uri, fetcher, userObj) => {
    return fetcher(`${uri}/user/`, {credentials: 'include', body: JSON.stringify(userObj), method: 'POST'})
        .then(res => res.json())
        .catch(passThroughLogger('error saving user: '));
}

const createRole = (uri, fetcher, roleObj) => {
    return fetcher(`${uri}/api/v1/role/new`, {credentials: 'include', body: JSON.stringify(roleObj), method: 'POST'})
        .then(res => res.json)
        .catch(passThroughLogger('error creating role: '));
}

const getRole = (uri, fetcher, roleId) => {
    return fetcher(`${uri}/api/v1/role/${roleId}`, {credentials: 'include'})
        .then(res => res.json())
        .catch(passThroughLogger('error getting role: '));
}

const updateRole = (uri, fetcher, roleId, roleObj) => {
    return fetcher(`${uri}/api/v1/role/${roleId}`, {credentials: 'include', body: JSON.stringify(roleObj), method: 'POST'})
        .then(res => res.json)
        .catch(passThroughLogger('error updating role: '));
}


const getCompany = (uri, fetcher, orgId) => {
    return fetcher(`${uri}/api/v1/org/${orgId}`, {credentials: 'include'})
        .then(res => res.json())
        .catch(passThroughLogger('error getting company: '));
}

const createCompany = (uri, fetcher, orgObj) => {
    return fetcher(`${uri}/api/v1/org/new`, {credentials: 'include', body: JSON.stringify(orgObj), method: 'POST'})
        .then(res => res.json())
        .catch(passThroughLogger('error creating company: '));
}

const updateCompany = (uri, fetcher, orgId, orgObj) => {
    return fetcher(`${uri}/api/v1/org/${orgId}`, {credentials: 'include', body: JSON.stringify(orgObj), method: 'POST'})
        .then(res => res.json())
        .catch(passThroughLogger('error updating company: '));
}

const search = (uri, fetcher, search) => {
    return fetcher(`${uri}/api/v1/search?search=${search}`, {credentials: 'include'})
        .then(res => res.json())
        .catch(passThroughLogger('error searching: '));
}

const injector = mapOfFuncs => {
  return Object.keys(mapOfFuncs)
    .reduce((memo, funcName) => {
      let newObj = {};
      newObj[funcName] = mapOfFuncs[funcName].bind(this, baseUrl, fetch);
      return {...memo, ...newObj};
    }, {});
}

const curriedFuncs = injector({
  getInitialData,
  getRoleInfo,
  getSession,
  login,
  getApplicant,
  logout,
  getUsers,
  getCompanies,
  getAdminData,
  getUser,
  updateUser,
  createRole,
  updateRole,
  getRole,
  createCompany,
  updateCompany,
  getCompany,
  loginDigest,
  updateCurrentUser,
  createUser,
  getApplicants,
  search,
  logout
});

export default curriedFuncs;
