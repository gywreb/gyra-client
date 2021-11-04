import { capitalize } from 'lodash';
import { apiClient, TASK_API } from 'src/configs/api';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';

// - GET TASK BY PROJECT
export const GET_TASK_REQUEST = '@TASK/GET_TASK_REQUEST';
export const GET_TASK_BY_PROJECT_SUCCESS = '@TASK/GET_TASK_BY_PROJECT_SUCCESS';
export const GET_TASK_BY_PROJECT_ERROR = '@TASK/GET_TASK_BY_PROJECT_ERROR';

// - CREATE TASK
export const CREATE_TASK_REQUEST = '@TASK/CREATE_TASK_REQUEST';
export const CREATE_TASK_SUCCESS = '@TASK/CREATE_TASK_SUCCESS';
export const CREATE_TASK_ERROR = '@TASK/CREATE_TASK_ERROR';

export const getTaskListByProject = projectId => async dispatch => {
  dispatch({ type: GET_TASK_REQUEST });
  try {
    const {
      data: {
        data: { taskListByProject, lastTaskKey },
      },
    } = await apiClient.get(TASK_API.getTaskListByProject(projectId));
    console.log(`taskListByProject`, taskListByProject);
    dispatch({
      type: GET_TASK_BY_PROJECT_SUCCESS,
      payload: { taskListByProject, lastTaskKey },
    });
  } catch (error) {
    console.log(error);
    let errorMessage = null;
    dispatch({ type: GET_TASK_BY_PROJECT_ERROR, payload: { error } });
    // if (error?.response?.data) {
    //   const { message } = error?.response?.data;
    //   if (typeof message === 'string') errorMessage = message;
    //   else if (typeof message === 'object')
    //     errorMessage = formatErrorMessage(message);
    // }
    // toast({
    //   title: capitalize(errorMessage || 'failed to create new project!'),
    //   position: 'top',
    //   status: 'error',
    //   duration: 3000,
    //   isClosable: true,
    // });
  }
};

export const createTask = (params, toast, resetForm) => async dispatch => {
  dispatch({ type: CREATE_TASK_REQUEST });
  try {
    const {
      data: {
        data: { newTask, lastTaskKey },
      },
    } = await apiClient.post(TASK_API.createTask, params);
    resetForm();
    dispatch({ type: CREATE_TASK_SUCCESS, payload: { newTask, lastTaskKey } });
    toast({
      title: capitalize('successfully created new task!'),
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    let errorMessage = null;
    dispatch({ type: CREATE_TASK_ERROR, payload: { error } });
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      if (typeof message === 'string') errorMessage = message;
      else if (typeof message === 'object')
        errorMessage = formatErrorMessage(message);
    }
    toast({
      title: capitalize(errorMessage || 'failed to create new task'),
      position: 'top',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};
