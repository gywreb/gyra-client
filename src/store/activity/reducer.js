import {
  GET_ACTIVITY_LIST_ERROR,
  GET_ACTIVITY_LIST_REQUEST,
  GET_ACTIVITY_LIST_SUCCESS,
} from './action';

const initialState = {
  currentActivityList: [],
  currentTotalPage: 1,
  error: null,
  isLoadMore: false,
  getActivityLoading: false,
};

export default function activityReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ACTIVITY_LIST_REQUEST: {
      if (action.payload.isLoadMore) {
        return { ...state, isLoadMore: true };
      } else {
        return { ...state, getActivityLoading: true };
      }
    }
    case GET_ACTIVITY_LIST_SUCCESS: {
      if (action.payload.isLoadMore) {
        return {
          ...state,
          isLoadMore: false,
          currentActivityList: [
            ...state.currentActivityList,
            ...action.payload.currentActivityList,
          ],
          error: null,
        };
      } else {
        return {
          ...state,
          getActivityLoading: false,
          currentActivityList: action.payload.currentActivityList,
          currentTotalPage: action.payload.currentTotalPage,
          error: null,
        };
      }
    }
    case GET_ACTIVITY_LIST_ERROR: {
      return {
        ...state,
        currentActivityList: [],
        currentTotalPage: 1,
        isLoadMore: false,
        getActivityLoading: false,
        error: action.payload.error,
      };
    }
    default:
      return state;
  }
}
