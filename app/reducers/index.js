import reducer from './main-reducer';
import roleReducer from './role-details-reducer';
import adminReducer from './admin-reducer.js';
import adminRoleReducer from './admin-role.js';
import userReducer from './admin-user.js';
import companyReducer from './admin-company.js';
import applicantCacheReducer from './applicants-cache-reducer.js';
import notification from './notification.js';
import { combineReducers } from 'redux';

export default combineReducers({
  reducer,
  roleReducer,
  adminReducer,
  adminRoleReducer,
  userReducer,
  notification,
  applicantCacheReducer,
  companyReducer
});
