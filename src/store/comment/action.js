import { capitalize } from 'lodash';
import { apiClient, COMMENT_API } from 'src/configs/api';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';

// CREATE COMMENT
export const CREATE_COMMENT_REQUEST = '@COMMENT/CREATE_COMMENT_REQUEST';
export const CREATE_COMMENT_SUCCESS = '@COMMENT/CREATE_COMMENT_SUCCESS';
export const CREATE_COMMENT_ERROR = '@COMMENT/CREATE_COMMENT_ERROR';

// GET COMMENT
export const GET_COMMENT_REQUEST = '@COMMENT/GET_COMMENT_REQUEST';
export const GET_COMMENT_SUCCESS = '@COMMENT/GET_COMMENT_SUCCESS';
export const GET_COMMENT_ERROR = '@COMMENT/GET_COMMENT_ERROR';

export const createComment =
  (taskId, params, toast, onSuccessReset) => async (dispatch, getState) => {
    const { currentProject } = getState().project;
    if (!currentProject) return;
    dispatch({ type: CREATE_COMMENT_REQUEST });
    try {
      const {
        data: {
          data: { newComment },
        },
      } = await apiClient.post(COMMENT_API.createComment(taskId), {
        ...params,
        projectId: currentProject?._id,
      });
      if (onSuccessReset) onSuccessReset();
      dispatch({ type: CREATE_COMMENT_SUCCESS, payload: { newComment } });
    } catch (error) {
      let errorMessage = null;
      if (onSuccessReset) onSuccessReset();
      dispatch({ type: CREATE_COMMENT_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      toast({
        title: capitalize(errorMessage || 'failed to create new comment'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

export const getCommentList =
  (taskId, perPage, page, toast, isLoadMore) => async dispatch => {
    dispatch({ type: GET_COMMENT_REQUEST, payload: { isLoadMore } });
    try {
      const {
        data: {
          data: { commentList },
        },
      } = await apiClient.get(COMMENT_API.getCommentByTask(taskId), {
        params: { perPage, page },
      });
      dispatch({
        type: GET_COMMENT_SUCCESS,
        payload: {
          currentCommentList: commentList.docs,
          currentTotalComment: commentList.totalPages,
          isLoadMore,
        },
      });
    } catch (error) {
      let errorMessage = null;
      dispatch({ type: GET_COMMENT_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      toast({
        title: capitalize(errorMessage || 'failed to get comment list'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
