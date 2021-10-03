import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_ERROR,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from './actions';

const initialState = {
  userInfo: null,
  token: null,
  loading: false,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER_REQUEST: {
      return { ...state, loading: true, error: null };
    }
    case REGISTER_SUCCESS: {
      return { ...state, loading: false, error: null };
    }
    case REGISTER_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }
    case LOGIN_REQUEST: {
      return {
        ...state,
        loading: true,
        userInfo: null,
        token: null,
        error: null,
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        userInfo: action.payload.userInfo,
        token: action.payload.token,
      };
    }
    case LOGIN_ERROR: {
      return {
        ...state,
        loading: false,
        userInfo: null,
        token: null,
        error: action.payload.error,
      };
    }
    default:
      return state;
  }
}
