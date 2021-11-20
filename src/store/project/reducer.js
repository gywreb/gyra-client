import {
  CREATE_PROJECT_ERROR,
  CREATE_PROJECT_REQUEST,
  CREATE_PROJECT_SUCCESS,
  EDIT_PROJECT_ERROR,
  EDIT_PROJECT_REQUEST,
  EDIT_PROJECT_SUCCESS,
  GET_PROJECTS_ERROR,
  GET_PROJECTS_REQUEST,
  GET_PROJECTS_SUCCESS,
  GET_PROJECT_DETAIL_ERROR,
  GET_PROJECT_DETAIL_REQUEST,
  GET_PROJECT_DETAIL_SUCCESS,
} from './action';

const initialState = {
  projectList: [],
  isGetProjectDetail: false,
  currentProject: null,
  createLoading: false,
  getLoading: false,
  editLoading: false,
  error: null,
};

export default function projectReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_PROJECT_REQUEST: {
      return { ...state, createLoading: true, error: null };
    }
    case CREATE_PROJECT_SUCCESS: {
      return {
        ...state,
        createLoading: false,
        projectList: [action.payload.newProject, ...state.projectList],
        error: null,
      };
    }
    case CREATE_PROJECT_ERROR: {
      return {
        ...state,
        createLoading: false,
        error: action.payload.error,
      };
    }
    case GET_PROJECTS_REQUEST: {
      return { ...state, getLoading: true, error: null };
    }
    case GET_PROJECTS_SUCCESS: {
      return {
        ...state,
        getLoading: false,
        projectList: [...action.payload.projectList],
        error: null,
      };
    }
    case GET_PROJECTS_ERROR: {
      return { ...state, getLoading: false, error: null, projectList: null };
    }
    case GET_PROJECT_DETAIL_REQUEST: {
      return { ...state, isGetProjectDetail: true, error: null };
    }
    case GET_PROJECT_DETAIL_SUCCESS: {
      return {
        ...state,
        isGetProjectDetail: false,
        currentProject: action.payload.currentProject,
        error: null,
      };
    }
    case GET_PROJECT_DETAIL_ERROR: {
      return {
        ...state,
        isGetProjectDetail: false,
        currentProject: null,
        error: action.payload.error,
      };
    }
    case EDIT_PROJECT_REQUEST: {
      return { ...state, editLoading: true };
    }
    case EDIT_PROJECT_SUCCESS: {
      const { updatedProject } = action.payload;
      const updatedProjectIndex = state.projectList.findIndex(
        project => project._id === updatedProject._id
      );
      if (updatedProject._id === state.currentProject._id) {
        return {
          ...state,
          editLoading: false,
          currentProject: { ...state.currentProject, ...updatedProject },
          projectList: [
            ...state.projectList.slice(0, updatedProjectIndex),
            { ...updatedProject },
            ...state.projectList.slice(updatedProjectIndex + 1),
          ],
        };
      } else {
        return {
          ...state,
          editLoading: false,
          projectList: [
            ...state.projectList.slice(0, updatedProjectIndex),
            { ...updatedProject },
            ...state.projectList.slice(updatedProjectIndex + 1),
          ],
        };
      }
    }
    case EDIT_PROJECT_ERROR: {
      return { ...state, editLoading: false, error: action.payload.action };
    }
    default:
      return state;
  }
}
