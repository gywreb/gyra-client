import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import columnReducer from './column/reducer';
import navigationReducer from './navigation/reducer';
import projectReducer from './project/reducer';
import taskReducer from './task/reducer';
import userReducer from './user/reducer';

const reducer = combineReducers({
  auth: authReducer,
  navigation: navigationReducer,
  project: projectReducer,
  column: columnReducer,
  task: taskReducer,
  user: userReducer,
});

export default reducer;
