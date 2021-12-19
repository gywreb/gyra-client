import { capitalize } from 'lodash';
import { apiClient, TASK_API } from 'src/configs/api';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';
import {
  RESTART_COLUMN_MOVE_TASK_ERROR,
  SET_COLUMN_AFTER_CREATE_TASK,
  SET_COLUMN_AFTER_DONE_TASK,
  SET_COLUMN_AFTER_MOVE_TASK,
} from '../column/action';

// - GET TASK BY PROJECT
export const GET_TASK_REQUEST = '@TASK/GET_TASK_REQUEST';
export const GET_TASK_BY_PROJECT_SUCCESS = '@TASK/GET_TASK_BY_PROJECT_SUCCESS';
export const GET_TASK_BY_PROJECT_ERROR = '@TASK/GET_TASK_BY_PROJECT_ERROR';

// - CREATE TASK
export const CREATE_TASK_REQUEST = '@TASK/CREATE_TASK_REQUEST';
export const CREATE_TASK_SUCCESS = '@TASK/CREATE_TASK_SUCCESS';
export const CREATE_TASK_ERROR = '@TASK/CREATE_TASK_ERROR';

// - MOVE TASK
export const MOVE_TASK_REQUEST = '@TASK/MOVE_TASK_REQUEST';
export const MOVE_TASK_SUCCESS = '@TASK/MOVE_TASK_SUCCESS';
export const MOVE_TASK_ERROR = '@TASK/MOVE_TASK_ERROR';

// - EDIT TASK
export const EDIT_TASK_REQUEST = '@TASK/EDIT_TASK_REQUEST';
export const EDIT_TASK_SUCCESS = '@TASK/EDIT_TASK_SUCCESS';
export const EDIT_TASK_ERROR = '@TASK/EDIT_TASK_ERROR';

// - TOGGLE SUBTASKS STATUS
export const TOGGLE_SUBTASK_STATUS_REQUEST =
  '@TASK/TOGGLE_SUBTASK_STATUS_REQUEST';
export const TOGGLE_SUBTASK_STATUS_SUCCESS =
  '@TASK/TOGGLE_SUBTASK_STATUS_SUCCESS';
export const TOGGLE_SUBTASK_STATUS_ERROR = '@TASK/TOGGLE_SUBTASK_STATUS_ERROR';

// - DONE TASK
export const DONE_TASK_REQUEST = '@TASK/DONE_TASK_REQUEST';
export const DONE_TASK_SUCCESS = '@TASK/DONE_TASK_SUCCESS';
export const DONE_TASK_ERROR = '@TASK/DONE_TASK_ERROR';

// - RESOLVE TASK
export const RESOLVE_TASK_REQUEST = '@TASK/RESOLVE_TASK_REQUEST';
export const RESOLVE_TASK_SUCCESS = '@TASK/RESOLVE_TASK_SUCCESS';
export const RESOLVE_TASK_ERROR = '@TASK/RESOLVE_TASK_ERROR';

// - CLOSE TASK
export const CLOSE_TASK_REQUEST = '@TASK/CLOSE_TASK_REQUEST';
export const CLOSE_TASK_SUCCESS = '@TASK/CLOSE_TASK_SUCCESS';
export const CLOSE_TASK_ERROR = '@TASK/CLOSE_TASK_ERROR';

// - REOPEN TASK
export const REOPEN_TASK_REQUEST = '@TASK/REOPEN_TASK_REQUEST';
export const REOPEN_TASK_SUCCESS = '@TASK/REOPEN_TASK_SUCCESS';
export const REOPEN_TASK_ERROR = '@TASK/REOPEN_TASK_ERROR';

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
        data: { newTask, lastTaskKey, newColumn },
      },
    } = await apiClient.post(TASK_API.createTask, params);
    resetForm();
    dispatch({ type: CREATE_TASK_SUCCESS, payload: { newTask, lastTaskKey } });
    dispatch({ type: SET_COLUMN_AFTER_CREATE_TASK, payload: { newColumn } });
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

export const moveTaskInBoard =
  (moveTaskId, moveTaskParams, toast) => async (dispatch, getState) => {
    dispatch({ type: MOVE_TASK_REQUEST });
    const { taskListByProject } = getState().task;
    try {
      dispatch({
        type: SET_COLUMN_AFTER_MOVE_TASK,
        payload: { taskId: moveTaskId, moveTaskParams, toast },
      });
      const {
        data: {
          data: { fromColumn, toColumn, updatedTask },
        },
      } = await apiClient.put(
        TASK_API.moveTaskInBoard(moveTaskId),
        moveTaskParams
      );
      dispatch({ type: MOVE_TASK_SUCCESS, payload: { updatedTask } });
      let displayMess = !(fromColumn._id === toColumn._id)
        ? `Task ${
            taskListByProject
              .find(task => task._id === updatedTask._id)
              ?.task_key?.toUpperCase() || ''
          } has transitioned from '${fromColumn?.name}' to '${toColumn?.name}'`
        : `Task ${
            taskListByProject.find(task => task._id === updatedTask._id)
              ?.task_key || ''
          } status has updated`;
      toast({
        title: displayMess || '',
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: RESTART_COLUMN_MOVE_TASK_ERROR });
      dispatch({ type: MOVE_TASK_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      console.log(`error`, error);
      toast({
        title: capitalize(errorMessage || 'failed to move task'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

export const editTask =
  (taskId, updateParams, toast) => async (dispatch, getState) => {
    const { taskListByProject } = getState().task;
    const taskInStore = taskListByProject.find(task => task._id === taskId);
    if (!taskInStore) return;
    dispatch({ type: EDIT_TASK_REQUEST });
    try {
      const {
        data: {
          data: { fromColumn, toColumn, updatedTask },
        },
      } = await apiClient.put(TASK_API.editTask(taskId), updateParams);
      if (toColumn?._id && fromColumn._id !== toColumn._id) {
        dispatch({
          type: SET_COLUMN_AFTER_MOVE_TASK,
          payload: {
            taskId: updatedTask._id,
            moveTaskParams: {
              fromColumnId: fromColumn._id,
              toColumnId: toColumn._id,
              toIndex: null,
            },
            toast,
          },
        });
      }
      dispatch({ type: EDIT_TASK_SUCCESS, payload: { updatedTask } });
      toast({
        title: `Task ${updatedTask.task_key} updated successfully!`,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: EDIT_TASK_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      console.log(`error`, error);
      toast({
        title: capitalize(errorMessage || 'failed to move task'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

export const toggleSubTaskStatus =
  (taskId, subTaskId, toast) => async (dispatch, getState) => {
    const { taskListByProject } = getState().task;
    const taskInStore = taskListByProject.find(task => task._id === taskId);
    if (!taskInStore) return;
    dispatch({ type: TOGGLE_SUBTASK_STATUS_REQUEST });
    try {
      const {
        data: {
          data: { updatedTask },
        },
      } = await apiClient.put(TASK_API.toggleTask, { taskId, subTaskId });

      dispatch({
        type: TOGGLE_SUBTASK_STATUS_SUCCESS,
        payload: { updatedTask },
      });
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: TOGGLE_SUBTASK_STATUS_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      console.log(`error`, error);
      toast({
        title: capitalize(errorMessage || 'failed action'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

export const doneTask =
  (taskId, toast, closeModalOnSuccess) => async (dispatch, getState) => {
    const { taskListByProject } = getState().task;
    const taskInStore = taskListByProject.find(task => task._id === taskId);
    if (!taskInStore) return;
    dispatch({ type: DONE_TASK_REQUEST });
    try {
      const {
        data: {
          data: { updatedTask, updatedColumn },
        },
      } = await apiClient.put(TASK_API.doneTask(taskId));
      dispatch({
        type: DONE_TASK_SUCCESS,
        payload: { updatedTask },
      });
      dispatch({
        type: SET_COLUMN_AFTER_DONE_TASK,
        payload: {
          taskId: updatedTask._id,
          updatedColumn,
        },
      });
      closeModalOnSuccess();
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: DONE_TASK_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      toast({
        title: capitalize(errorMessage || 'failed action'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

export const resolveTask =
  (taskId, toast, closeModalOnSuccess) => async (dispatch, getState) => {
    const { taskListByProject } = getState().task;
    const taskInStore = taskListByProject.find(task => task._id === taskId);
    if (!taskInStore) return;
    dispatch({ type: RESOLVE_TASK_REQUEST });
    try {
      const {
        data: {
          data: { updatedTask },
        },
      } = await apiClient.put(TASK_API.resolveTask(taskId));
      dispatch({
        type: RESOLVE_TASK_SUCCESS,
        payload: { updatedTask },
      });
      closeModalOnSuccess();
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: RESOLVE_TASK_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      toast({
        title: capitalize(errorMessage || 'failed action'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

export const reopenTask =
  (taskId, reopenColumn, toast, closeModalOnSuccess) =>
  async (dispatch, getState) => {
    const { taskListByProject } = getState().task;
    const taskInStore = taskListByProject.find(task => task._id === taskId);
    if (!taskInStore) return;
    dispatch({ type: REOPEN_TASK_REQUEST });
    try {
      const {
        data: {
          data: { updatedTask, updatedColumn },
        },
      } = await apiClient.put(TASK_API.reopenTask(taskId), { reopenColumn });
      dispatch({
        type: REOPEN_TASK_SUCCESS,
        payload: { updatedTask },
      });
      dispatch({
        type: SET_COLUMN_AFTER_DONE_TASK,
        payload: {
          taskId: updatedTask._id,
          updatedColumn,
        },
      });
      closeModalOnSuccess();
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: REOPEN_TASK_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      toast({
        title: capitalize(errorMessage || 'failed action'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
