import { capitalize } from 'lodash';
import { ACTIVITY_API, apiClient } from 'src/configs/api';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';
import { GET_PROJECT_DETAIL_SUCCESS } from '../project/action';

export const GET_ACTIVITY_LIST_REQUEST = '@ACTIVITY/GET_ACTIVITY_LIST_REQUEST';
export const GET_ACTIVITY_LIST_SUCCESS = '@ACTIVITY/GET_ACTIVITY_LIST_SUCCESS';
export const GET_ACTIVITY_LIST_ERROR = '@ACTIVITY/GET_ACTIVITY_LIST_ERROR';

export const getActivityList =
  (projectId, perPage, page, toast, isLoadMore) => async dispatch => {
    dispatch({
      type: GET_ACTIVITY_LIST_REQUEST,
      payload: { isLoadMore: isLoadMore ? true : false },
    });
    try {
      const {
        data: {
          data: { activityList, currentProject },
        },
      } = await apiClient.get(ACTIVITY_API.getActivityByProject(projectId), {
        params: { perPage, page },
      });
      console.log(`activityList`, activityList);
      dispatch({
        type: GET_PROJECT_DETAIL_SUCCESS,
        payload: { currentProject },
      });
      dispatch({
        type: GET_ACTIVITY_LIST_SUCCESS,
        payload: {
          currentActivityList: activityList.docs,
          currentTotalPage: activityList.totalPages,
          isLoadMore: isLoadMore ? true : false,
        },
      });
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
          errorMessage || 'failed to fetch activities data from server!'
        ),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      dispatch({ type: GET_ACTIVITY_LIST_ERROR, payload: { error } });
    }
  };
