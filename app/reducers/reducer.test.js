//const reducer = require('./index.js');
import reducer from './role-details-reducer';

const _ = undefined;

const defaultState = {
  role: {
    candidates: [],
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
  timeStamp: 0
};

it('should should return default state', () => {
  expect(reducer(_, {type: ''}));
})
