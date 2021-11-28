import {
  CREATE_COMMENT_ERROR,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  GET_COMMENT_ERROR,
  GET_COMMENT_REQUEST,
  GET_COMMENT_SUCCESS,
} from './action';

const initialState = {
  currentCommentList: [],
  currentTotalComment: 1,
  createLoading: false,
  isLoadMoreComment: false,
  getLoading: false,
  error: null,
};

export default function commentReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_COMMENT_REQUEST: {
      return { ...state, createLoading: true };
    }
    case CREATE_COMMENT_SUCCESS: {
      return {
        ...state,
        createLoading: false,
        currentCommentList: [
          action.payload.newComment,
          ...state.currentCommentList,
        ],
      };
    }
    case CREATE_COMMENT_ERROR: {
      return { ...state, createLoading: false, error: action.payload.error };
    }
    case GET_COMMENT_REQUEST: {
      if (action.payload.isLoadMore) {
        return { ...state, isLoadMoreComment: true };
      } else {
        return { ...state, getLoading: true };
      }
    }
    case GET_COMMENT_SUCCESS: {
      if (action.payload.isLoadMore) {
        return {
          ...state,
          isLoadMoreComment: false,
          currentCommentList: [
            ...state.currentCommentList,
            ...action.payload.currentCommentList,
          ],
          error: null,
        };
      } else {
        return {
          ...state,
          getLoading: false,
          currentCommentList: action.payload.currentCommentList,
          currentTotalComment: action.payload.currentTotalComment,
          error: null,
        };
      }
    }
    case GET_COMMENT_ERROR: {
      return {
        ...state,
        isLoadMoreComment: false,
        getLoading: false,
        error: action.payload.error,
      };
    }
    default:
      return state;
  }
}
