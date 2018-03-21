import { combineReducers } from 'redux';
import { candidates, roles, applicants } from './../mockDataApi';
import { handleActions, combineActions } from 'redux-actions';
import roleReducer from './role-details-reducer';
import {
  filterRoles,
  sortId,
  sortRole,
  sortDate,
  sortRank,
  sortDateReverse,
  sortDateComplete,
  sortDateInvited,
  sortDateCompleteReverse,
  sortDateInvitedReverse,
  sortRankReverse,
  toggleButton,
  login,
  loadState,
  checkDefaultState,
  logout
} from './../actions';

const defaultState = {
  role: {
    candidates: null,
    title: '',
    recruiter: '',
    fieldType: 1,
    id: 0,
    location: '',
    isActive: 0
  },
  roles: [],
  userName: '',
  toggleBot: false,
  isLoggedIn: {},
  loading: true,
  timeStamp: 0,
  applicants: []
};

const roleNameSorter = (a, b) => {
    if(a.title.toLowerCase() > b.title.toLowerCase()) return -1;
    if(a.title.toLowerCase() < b.title.toLowerCase()) return 1;
}

const reducer = handleActions({
  [checkDefaultState](state, action) {
    const defState = Object.assign({}, state, { isLoggedIn: action.payload })
      return defState;
  },
  [loadState](state, action) {
    return Object.assign({}, state,
      {
        timeStamp: new Date().getTime(),
        loading: false,
        ...action.payload,
        roles: action.payload.roles.sort(roleNameSorter).reverse()
      });
  },
  [filterRoles](state, action) {
    return Object.assign({}, state, { role: { ...action.payload } });
  },
  [combineActions(sortId, sortRole)](state, action) {
    return Object.assign({}, state, { roles: action.payload });
  },
  [combineActions(
    sortDate,
    sortRank,
    sortDateReverse,
    sortRankReverse,
    sortDateInvited,
    sortDateComplete,
    sortDateCompleteReverse,
    sortDateInvitedReverse)](state, action) {
    return Object.assign({}, state, { role: { ...state.role, candidates: action.payload } });
  },
  [login](state, action) {
      const userState = Object.assign({}, state, { isLoggedIn: action.payload });
        return userState;
  },
  [logout] (state, action) {
    const newState = {...state, isLoggedIn: defaultState.isLoggedIn };
    return defaultState;
  },
  [toggleButton](state, action) {
    return Object.assign({}, state, { toggleBot: !state.toggleBot });
  }
}, defaultState);

export default reducer;
