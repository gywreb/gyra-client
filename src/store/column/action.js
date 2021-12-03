import { capitalize } from 'lodash';
import { apiClient, COLUMN_API } from 'src/configs/api';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';

// - GET COLUMN
export const GET_COLUMN_REQUEST = '@COLUMN/GET_COLUMN_REQUEST';
export const GET_COLUMN_SUCCESS = '@COLUMN/GET_COLUMN_SUCCESS';
export const GET_COLUMN_ERROR = '@COLUMN/GET_COLUMN_ERROR';

// - CREATE COLUMN
export const CREATE_COLUMN_REQUEST = '@COLUMN/CREATE_COLUMN_REQUEST';
export const CREATE_COLUMN_SUCCESS = '@COLUMN/CREATE_COLUMN_SUCCESS';
export const CREATE_COLUMN_ERROR = '@COLUMN/CREATE_COLUMN_ERROR';

// EDIT COLUMN
export const EDIT_COLUMN_REQUEST = '@COLUMN/EDIT_COLUMN_REQUEST';
export const EDIT_COLUMN_SUCCESS = '@COLUMN/EDIT_COLUMN_SUCCESS';
export const EDIT_COLUMN_ERROR = '@COLUMN/EDIT_COLUMN_ERROR';

export const SET_COLUMN_AFTER_CREATE_TASK =
  '@COLUMN/SET_COLUMN_AFTER_CREATE_TASK';
export const SET_COLUMN_AFTER_MOVE_TASK = '@COLUMN/SET_COLUMN_AFTER_MOVE_TASK';
export const RESTART_COLUMN_MOVE_TASK_ERROR =
  '@COLUMN/RESTART_COLUMN_MOVE_TASK_ERROR';

export const getColumnList = projectId => async dispatch => {
  dispatch({ type: GET_COLUMN_REQUEST });
  try {
    const {
      data: {
        data: { columnList },
      },
    } = await apiClient.get(COLUMN_API.getColumnByProject(projectId));
    console.log(`columnList`, columnList);
    dispatch({ type: GET_COLUMN_SUCCESS, payload: { columnList } });
  } catch (error) {
    console.log(error);
    let errorMessage = null;
    dispatch({ type: GET_COLUMN_ERROR, payload: { error } });
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

export const createColumn = (params, toast, resetForm) => async dispatch => {
  dispatch({ type: CREATE_COLUMN_REQUEST });
  try {
    const {
      data: {
        data: { newColumn },
      },
    } = await apiClient.post(COLUMN_API.createColumn, params);
    resetForm();
    dispatch({ type: CREATE_COLUMN_SUCCESS, payload: { newColumn } });
  } catch (error) {
    let errorMessage = null;
    dispatch({ type: CREATE_COLUMN_ERROR, payload: { error } });
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      if (typeof message === 'string') errorMessage = message;
      else if (typeof message === 'object')
        errorMessage = formatErrorMessage(message);
    }
    toast({
      title: capitalize(errorMessage || 'failed to create new column'),
      position: 'top',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

export const editColumn =
  (columnId, projectId, params, toast, resetForm) => async dispatch => {
    dispatch({ type: EDIT_COLUMN_REQUEST });
    try {
      const {
        data: {
          data: { updatedColumn },
        },
      } = await apiClient.put(COLUMN_API.editColumn(columnId), params, {
        params: { projectId },
      });
      resetForm();
      dispatch({ type: EDIT_COLUMN_SUCCESS, payload: { updatedColumn } });
      toast({
        title: 'Updated status successfully',
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: EDIT_COLUMN_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      toast({
        title: capitalize(errorMessage || 'failed to update column'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
