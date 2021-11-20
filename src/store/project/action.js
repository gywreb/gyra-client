import { capitalize } from 'lodash';
import { apiClient, PROJECT_API } from 'src/configs/api';
import { ROUTE_KEY } from 'src/configs/router';
import { formatErrorMessage } from '../../utils/formatErrorMessage';

// CREATE PROJECT
export const CREATE_PROJECT_REQUEST = '@PROJECT/CREATE_PROJECT_REQUEST';
export const CREATE_PROJECT_SUCCESS = '@PROJECT/CREATE_PROJECT_SUCCESS';
export const CREATE_PROJECT_ERROR = '@PROJECT/CREATE_PROJECT_ERROR';

// GET PROJECTS
export const GET_PROJECTS_REQUEST = '@PROJECT/GET_PROJECTS_REQUEST';
export const GET_PROJECTS_SUCCESS = '@PROJECT/GET_PROJECTS_SUCCESS';
export const GET_PROJECTS_ERROR = '@PROJECT/GET_PROJECTS_ERROR';

// GET PROJECT DETAIL
export const GET_PROJECT_DETAIL_REQUEST = '@PROJECT/GET_PROJECT_DETAIL_REQUEST';
export const GET_PROJECT_DETAIL_SUCCESS = '@PROJECT/GET_PROJECT_DETAIL_SUCCESS';
export const GET_PROJECT_DETAIL_ERROR = '@PROJECT/GET_PROJECT_DETAIL_ERROR';

// EDIT PROJECT
export const EDIT_PROJECT_REQUEST = '@PROJECT/EDIT_PROJECT_REQUEST';
export const EDIT_PROJECT_SUCCESS = '@PROJECT/EDIT_PROJECT_SUCCESS';
export const EDIT_PROJECT_ERROR = '@PROJECT/EDIT_PROJECT_ERROR';

export const createProject = (params, toast, closeModal) => async dispatch => {
  dispatch({ type: CREATE_PROJECT_REQUEST });
  try {
    const {
      data: {
        data: { newProject },
      },
    } = await apiClient.post(PROJECT_API.createProject, params);
    dispatch({ type: CREATE_PROJECT_SUCCESS, payload: { newProject } });
    closeModal();
    toast({
      title: `Create project successfully!`,
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    // console.log(error);
    // console.log(error?.response?.data);
    let errorMessage = null;
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      if (typeof message === 'string') errorMessage = message;
      else if (typeof message === 'object')
        errorMessage = formatErrorMessage(message);
    }
    toast({
      title: errorMessage || 'failed to create new project!',
      position: 'top',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    dispatch({ type: CREATE_PROJECT_ERROR, payload: { error } });
  }
};

export const getProjectList = toast => async dispatch => {
  dispatch({ type: GET_PROJECTS_REQUEST });
  try {
    const {
      data: {
        data: { projectList },
      },
    } = await apiClient.get(PROJECT_API.getProjects);
    dispatch({ type: GET_PROJECTS_SUCCESS, payload: { projectList } });
  } catch (error) {
    console.log(error);
    console.log(error?.response?.data);
    let errorMessage = null;
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      if (typeof message === 'string') errorMessage = message;
      else if (typeof message === 'object')
        errorMessage = formatErrorMessage(message);
    }
    toast({
      title: capitalize(
        errorMessage || 'failed to fetch project data from server!'
      ),
      position: 'top',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    dispatch({ type: GET_PROJECTS_ERROR, payload: { error } });
  }
};

export const getProjectDetail =
  (id, history, toast) => async (dispatch, getState) => {
    dispatch({ type: GET_PROJECT_DETAIL_REQUEST });
    // const { userInfo } = getState().auth;
    try {
      const {
        data: {
          data: { project },
        },
      } = await apiClient.get(`${PROJECT_API.getProjects}/${id}`);
      // if (
      //   project.manager._id === userInfo._id ||
      //   project.members.find(mem => mem._id === userInfo._id)
      // ) {
      //   dispatch({
      //     type: GET_PROJECT_DETAIL_SUCCESS,
      //     payload: { currentProject: project },
      //   });
      // } else {
      //   return history.push(ROUTE_KEY.NotFound);
      // }
      dispatch({
        type: GET_PROJECT_DETAIL_SUCCESS,
        payload: { currentProject: project },
      });
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data);
      let errorMessage = null;
      let errorStatus = null;
      if (error?.response?.data) {
        const { message, status } = error?.response?.data;
        errorStatus = status;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      if (errorStatus === 401 || 404) {
        history.replace({ pathname: ROUTE_KEY.NotFound });
      } else {
        history.replace(ROUTE_KEY.Projects);
        toast({
          title: capitalize(
            errorMessage || 'failed to fetch project data from server!'
          ),
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      dispatch({ type: GET_PROJECT_DETAIL_ERROR, payload: { error } });
    }
  };

export const editProject =
  (projectId, updateParams, toast, closeModal) =>
  async (dispatch, getState) => {
    const { projectList } = getState().project;
    const projectInStore = projectList.find(
      project => project._id === projectId
    );
    if (!projectInStore) return;
    dispatch({ type: EDIT_PROJECT_REQUEST });
    try {
      const {
        data: {
          data: { updatedProject },
        },
      } = await apiClient.put(PROJECT_API.editProject(projectId), updateParams);
      dispatch({ type: EDIT_PROJECT_SUCCESS, payload: { updatedProject } });
      if (closeModal) closeModal();
      toast({
        title: `Project: ${updatedProject.name} updated successfully!`,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: EDIT_PROJECT_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      console.log(`error`, error);
      toast({
        title: capitalize(errorMessage || 'failed to edit project'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
