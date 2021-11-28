import moment from 'moment';
import {
  GET_NOTIFICATIONS_ERROR,
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  SEEN_ALL_NOTIFICATIONS_ERROR,
  SEEN_ALL_NOTIFICATIONS_REQUEST,
  SEEN_ALL_NOTIFICATIONS_SUCCESS,
} from './action';

const initialState = {
  notiList: [],
  totalNotis: 1,
  totalUnseen: 0,
  getLoading: false,
  seenAllLoading: false,
  isLoadMoreNotis: false,
  error: null,
  lastFetchData: null,
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS_REQUEST: {
      if (action.payload.isLoadMore) {
        return { ...state, isLoadMoreNotis: true };
      } else return { ...state, getLoading: true, lastFetchData: null };
    }
    case GET_NOTIFICATIONS_SUCCESS: {
      if (action.payload.isLoadMore) {
        return {
          ...state,
          isLoadMoreNotis: false,
          notiList: [...state.notiList, ...action.payload.notiList],
          totalUnseen: action.payload.totalUnseen,
          error: null,
        };
      } else {
        return {
          ...state,
          getLoading: false,
          notiList: action.payload.notiList,
          totalNotis: action.payload.totalNotis,
          lastFetchData: moment(),
          totalUnseen: action.payload.totalUnseen,
          error: null,
        };
      }
    }
    case GET_NOTIFICATIONS_ERROR: {
      return {
        ...state,
        isLoadMoreNotis: false,
        getLoading: false,
        error: action.payload.error,
        lastFetchData: null,
      };
    }
    case SEEN_ALL_NOTIFICATIONS_REQUEST: {
      return { ...state, seenAllLoading: true };
    }
    case SEEN_ALL_NOTIFICATIONS_SUCCESS: {
      return {
        ...state,
        notiList: state.notiList.map(noti => ({
          ...noti,
          seen: true,
        })),
        seenAllLoading: false,
        totalUnseen: 0,
      };
    }
    case SEEN_ALL_NOTIFICATIONS_ERROR: {
      return { ...state, seenAllLoading: false, error: action.payload.error };
    }
    default:
      return state;
  }
}
