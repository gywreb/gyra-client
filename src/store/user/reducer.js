import {
  GET_ALL_USER_ERROR,
  GET_ALL_USER_REQUEST,
  GET_ALL_USER_SUCCESS,
} from './action';

const initialState = {
  getAllLoading: false,
  currentUserList: [],
  currentTotalPage: 1,
  isLoadMore: false,
  error: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USER_REQUEST: {
      if (action.payload.isLoadMore) {
        return { ...state, isLoadMore: true };
      } else {
        return { ...state, getAllLoading: true };
      }
    }
    case GET_ALL_USER_SUCCESS: {
      if (action.payload.isLoadMore) {
        return {
          ...state,
          isLoadMore: false,
          currentUserList: [
            ...state.currentUserList,
            ...action.payload.currentUserList,
          ],
          error: null,
        };
      } else {
        return {
          ...state,
          getAllLoading: false,
          currentUserList: action.payload.currentUserList,
          currentTotalPage: action.payload.currentTotalPage,
          error: null,
        };
      }
    }
    case GET_ALL_USER_ERROR: {
      return {
        ...state,
        currentUserList: [],
        currentTotalPage: 1,
        getAllLoading: false,
        isLoadMore: true,
        error: action.payload.error,
      };
    }
    default:
      return state;
  }
}
