import { combineReducers } from 'redux';
import activityReducer from './activity/reducer';
import authReducer from './auth/reducer';
import columnReducer from './column/reducer';
import commentReducer from './comment/reducer';
import navigationReducer from './navigation/reducer';
import notificationReducer from './notification/reducer';
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
  activity: activityReducer,
  comment: commentReducer,
  notification: notificationReducer,
});

export default reducer;
