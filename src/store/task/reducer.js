import {
  CREATE_TASK_ERROR,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  EDIT_TASK_ERROR,
  EDIT_TASK_REQUEST,
  EDIT_TASK_SUCCESS,
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
  editTaskLoading: false,
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
      const updatedTaskIndex = state.taskListByProject.findIndex(
        task => task._id === action.payload.updatedTask._id
      );
      if (updatedTaskIndex === -1) return { ...state, moveTaskLoading: false };
      return {
        ...state,
        moveTaskLoading: false,
        taskListByProject: [
          ...state.taskListByProject.slice(0, updatedTaskIndex),
          action.payload.updatedTask,
          ...state.taskListByProject.slice(updatedTaskIndex + 1),
        ],
      };
    }
    case MOVE_TASK_ERROR: {
      return { ...state, moveTaskLoading: false };
    }
    case EDIT_TASK_REQUEST: {
      return { ...state, editTaskLoading: true };
    }
    case EDIT_TASK_SUCCESS: {
      const updatedTaskIndex = state.taskListByProject.findIndex(
        task => task._id === action.payload.updatedTask._id
      );
      if (updatedTaskIndex === -1) return { ...state, editTaskLoading: false };
      return {
        ...state,
        editTaskLoading: false,
        taskListByProject: [
          ...state.taskListByProject.slice(0, updatedTaskIndex),
          action.payload.updatedTask,
          ...state.taskListByProject.slice(updatedTaskIndex + 1),
        ],
      };
    }
    case EDIT_TASK_ERROR: {
      return { ...state, editTaskLoading: false };
    }
    default:
      return state;
  }
}
