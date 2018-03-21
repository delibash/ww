import { createActions, createAction } from 'redux-actions';

const role = (a, b) => {
    if(a.title.toLowerCase() > b.title.toLowerCase()) return -1;
    if(a.title.toLowerCase() < b.title.toLowerCase()) return 1;
}

const id = (a, b) => a.id > b.id;

const dateCompleted = obj => obj.person['date-chatted'] ? obj.person['date-chatted'] : 0;
const dateApplied = obj => obj.time ? obj.time : 0;
const dateInvited = obj => obj.person['date-invited'] ? obj.person['date-invited'] : 0;

const date = type => {
    return (a, b) => {
      const aTime = Date.parse(type(a));
      const bTime = Date.parse(type(b));
      if(aTime > bTime) return -1;
      if(aTime < bTime) return 1;
    }
}

const rank = (a, b) => a.rank - b.rank;

export const {
  sortId,
  sortRole,
  sortRank,
  sortDate,
  sortDateReverse,
  sortDateComplete,
  sortDateCompleteReverse,
  sortDateInvited,
  sortDateInvitedReverse,
  sortRankReverse,
  filterRoles,
  toggleButton,
  login,
  loadState,
  checkDefaultState,
  logout
} = createActions({
  'CHECK_DEFAULT_STATE': state => state,
  'LOAD_STATE': state => state,
  'SORT_DATE': sorted => sorted ? sorted.sort(date(dateApplied)) : sorted,
  'SORT_DATE_REVERSE': sorted => sorted ? sorted.sort(date(dateApplied)).reverse() : sorted,
  'SORT_DATE_COMPLETE': sorted => sorted ? sorted.sort(date(dateCompleted)) : sorted,
  'SORT_DATE_COMPLETE_REVERSE': sorted => sorted ? sorted.sort(date(dateCompleted)).reverse() : sorted,
  'SORT_DATE_INVITED': sorted => sorted ? sorted.sort(date(dateInvited)) : sorted,
  'SORT_DATE_INVITED_REVERSE': sorted => sorted ? sorted.sort(date(dateInvited)).reverse() : sorted,
  'SORT_RANK': sorted => sorted ? sorted.sort(rank) : sorted,
  'SORT_RANK_REVERSE': sorted => sorted ? sorted.sort(rank).reverse() : sorted,
  'SORT_ID': sorted => sorted ? sorted.sort(id) : sorted,
  'SORT_ROLE': sorted => sorted ? sorted.sort(role).reverse() : sorted,
  'FILTER_ROLES': role => {
    const filteredCandidate = role.candidates
      ? role.candidates.sort(date(dateApplied))
      : role.candidates || [];

    return {...role, candidates: filteredCandidate};
  },
  'TOGGLE_BUTTON': value => value,
  'LOGIN': state => state,
  'LOGOUT': state => state,
});
