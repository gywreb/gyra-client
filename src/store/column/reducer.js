import {
  CREATE_COLUMN_ERROR,
  CREATE_COLUMN_REQUEST,
  CREATE_COLUMN_SUCCESS,
  GET_COLUMN_ERROR,
  GET_COLUMN_REQUEST,
  GET_COLUMN_SUCCESS,
} from './action';

const initialState = {
  columnList: [],
  postLoading: false,
  getLoading: false,
  error: null,
};

export default function columnReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_COLUMN_REQUEST: {
      return { ...state, postLoading: true, error: null };
    }
    case CREATE_COLUMN_SUCCESS: {
      return {
        ...state,
        postLoading: false,
        columnList: [...state.columnList, action.payload.newColumn],
        error: null,
      };
    }
    case CREATE_COLUMN_ERROR: {
      return { ...state, postLoading: false, error: action.payload.error };
    }
    case GET_COLUMN_REQUEST: {
      return { ...state, getLoading: true, error: null };
    }
    case GET_COLUMN_SUCCESS: {
      return {
        ...state,
        getLoading: false,
        columnList: [...action.payload.columnList],
        error: null,
      };
    }
    case GET_COLUMN_ERROR: {
      return {
        ...state,
        getLoading: false,
        columnList: [],
        error: action.payload.error,
      };
    }
    default:
      return state;
  }
}
