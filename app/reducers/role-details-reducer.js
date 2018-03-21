const defState = {
  id: null,
  location: null,
  recruiter: null,
  title: null,
  candidates: null,
  loading: true,
  error: false,
  activeCandidate: {
  }
};

const buildCandidateObj = (candidateObj, candidate) => {
  const idString = candidate.person.id.toString();
  let newCandidate = {};
  newCandidate[idString] = candidate;
  return {
    ...candidateObj,
    ...newCandidate
  };
}

const roleReducer = (state = defState, {type, payload}={}) => {
  switch (type) {
    case "LOAD_ROLE_SUCESS":
      const idString = payload.activeCandidate.person.id.toString();
      let newCandidate = {};
      newCandidate[idString] = payload.activeCandidate;
      const activeCandidate = {
        ...state.activeCandidate,
        ...newCandidate
      };
      return {...state, ...payload, loading: false, activeCandidate};
    case "LOAD_ROLE_FAILURE":
      return {...state, error: payload, loading: false};
    case "EMPTY_CACHE":
      return defState;
    default:
      return state;
  }
}

export default roleReducer;
