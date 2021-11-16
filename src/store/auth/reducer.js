import {
  GET_CURRENT_ERROR,
  GET_CURRENT_REQUEST,
  GET_CURRENT_SUCCESS,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_ERROR,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from './actions';

const initialState = {
  userInfo: null,
  token: null,
  loading: false,
  getCurrentLoading: false,
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
    case GET_CURRENT_REQUEST: {
      return {
        ...state,
        getCurrentLoading: true,
        userInfo: null,
        token: null,
        error: null,
      };
    }
    case GET_CURRENT_SUCCESS: {
      return {
        ...state,
        getCurrentLoading: false,
        userInfo: action.payload.userInfo,
        token: action.payload.token,
        error: null,
      };
    }
    case GET_CURRENT_ERROR: {
      return {
        ...state,
        getCurrentLoading: false,
        userInfo: null,
        token: null,
        error: action.payload.error,
      };
    }
    case LOGOUT: {
      return { ...initialState };
    }
    default:
      return state;
  }
}
