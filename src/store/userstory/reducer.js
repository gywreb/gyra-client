import {
  CREATE_USER_STORY_ERROR,
  CREATE_USER_STORY_REQUEST,
  CREATE_USER_STORY_SUCCESS,
  GET_USER_STORIES_ERROR,
  GET_USER_STORIES_REQUEST,
  GET_USER_STORIES_SUCCESS,
} from './action';

const initialState = {
  currentUserStoryList: [],
  getLoading: false,
  createLoading: false,
  lastUserStoryKey: 0,
  error: null,
};

export function userStoryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_STORIES_REQUEST: {
      return { ...state, getLoading: true };
    }
    case GET_USER_STORIES_SUCCESS: {
      return {
        ...state,
        getLoading: false,
        currentUserStoryList: action.payload.currentUserStoryList,
        lastUserStoryKey: action.payload.lastUserStoryKey,
        error: null,
      };
    }
    case GET_USER_STORIES_ERROR: {
      return { ...state, getLoading: false, error: action.payload.error };
    }
    case CREATE_USER_STORY_REQUEST: {
      return { ...state, createLoading: true };
    }
    case CREATE_USER_STORY_SUCCESS: {
      return {
        ...state,
        createLoading: false,
        currentUserStoryList: [
          ...state.currentUserStoryList,
          action.payload.newUserStory,
        ],
        lastUserStoryKey: state.lastUserStoryKey + 1,
        error: null,
      };
    }
    case CREATE_USER_STORY_ERROR: {
      return { ...state, createLoading: false, error: action.payload.error };
    }
    default:
      return state;
  }
}
