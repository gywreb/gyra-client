import {
  CREATE_TASK_ERROR,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  GET_TASK_BY_PROJECT_ERROR,
  GET_TASK_BY_PROJECT_SUCCESS,
  GET_TASK_REQUEST,
  MOVE_TASK_ERROR,
  MOVE_TASK_REQUEST,
  MOVE_TASK_SUCCESS,
} from './action';

const initialState = {
  taskListByProject: [],
  currentLastTaskKey: 0,
  getLoading: false,
  postLoading: false,
  moveTaskLoading: false,
  error: null,
};

export default function taskReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_TASK_REQUEST: {
      return { ...state, postLoading: true, error: null };
    }
    case CREATE_TASK_SUCCESS: {
      return {
        ...state,
        postLoading: false,
        taskListByProject: [...state.taskListByProject, action.payload.newTask],
        currentLastTaskKey:
          action.payload.lastTaskKey || state.currentLastTaskKey + 1,
        error: null,
      };
    }
    case CREATE_TASK_ERROR: {
      return { ...state, postLoading: false, error: action.payload.error };
    }
    case GET_TASK_REQUEST: {
      return { ...state, getLoading: true, error: null, currentLastTaskKey: 0 };
    }
    case GET_TASK_BY_PROJECT_SUCCESS: {
      return {
        ...state,
        getLoading: false,
        taskListByProject: [...action.payload.taskListByProject],
        currentLastTaskKey: action.payload.lastTaskKey,
        error: null,
      };
    }
    case GET_TASK_BY_PROJECT_ERROR: {
      return {
        ...state,
        getLoading: false,
        error: action.payload.error,
        taskListByProject: [],
        currentLastTaskKey: 0,
      };
    }
    case MOVE_TASK_REQUEST: {
      return { ...state, moveTaskLoading: true };
    }
    case MOVE_TASK_SUCCESS: {
      return { ...state, moveTaskLoading: false };
    }
    case MOVE_TASK_ERROR: {
      return { ...state, moveTaskLoading: false };
    }
    default:
      return state;
  }
}
