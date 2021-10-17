import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import navigationReducer from './navigation/reducer';
import projectReducer from './project/reducer';

const reducer = combineReducers({
  auth: authReducer,
  navigation: navigationReducer,
  project: projectReducer,
});

export default reducer;
