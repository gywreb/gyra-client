import { capitalize } from 'lodash';
import { apiClient, NOTIFICATION_API } from 'src/configs/api';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';

// GET NOTIFICATION LIST
export const GET_NOTIFICATIONS_REQUEST =
  '@NOTIFICATION/GET_NOTIFICATIONS_REQUEST';
export const GET_NOTIFICATIONS_SUCCESS =
  '@NOTIFICATION/GET_NOTIFICATIONS_SUCCESS';
export const GET_NOTIFICATIONS_ERROR = '@NOTIFICATION/GET_NOTIFICATIONS_ERROR';

// SEEN ALL NOTI
export const SEEN_ALL_NOTIFICATIONS_REQUEST =
  '@NOTIFICATION/SEEN_ALL_NOTIFICATIONS_REQUEST';
export const SEEN_ALL_NOTIFICATIONS_SUCCESS =
  '@NOTIFICATION/SEEN_ALL_NOTIFICATIONS_SUCCESS';
export const SEEN_ALL_NOTIFICATIONS_ERROR =
  '@NOTIFICATION/SEEN_ALL_NOTIFICATIONS_ERROR';

export const getNotificationList =
  (perPage, page, toast, isLoadMore) => async dispatch => {
    dispatch({ type: GET_NOTIFICATIONS_REQUEST, payload: { isLoadMore } });
    try {
      const {
        data: {
          data: { notiList, totalUnseen },
        },
      } = await apiClient.get(NOTIFICATION_API.getNotiList, {
        params: { perPage, page },
      });
      dispatch({
        type: GET_NOTIFICATIONS_SUCCESS,
        payload: {
          totalUnseen,
          notiList: notiList.docs,
          totalNotis: notiList.totalPages,
          isLoadMore,
        },
      });
    } catch (error) {
      let errorMessage = null;
      //   console.log(`error`, error);
      //   console.log(`error`, error.response);
      dispatch({ type: GET_NOTIFICATIONS_ERROR, payload: { error } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        if (typeof message === 'string') errorMessage = message;
        else if (typeof message === 'object')
          errorMessage = formatErrorMessage(message);
      }
      toast({
        title: capitalize(errorMessage || 'failed to get notification list'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

export const seenAllNoti = toast => async dispatch => {
  dispatch({ type: SEEN_ALL_NOTIFICATIONS_REQUEST });
  try {
    const {
      data: { data },
    } = await apiClient.put(NOTIFICATION_API.seenAllNoti);
    dispatch({ type: SEEN_ALL_NOTIFICATIONS_SUCCESS });
    toast({
      title: capitalize('you have seen all the notification'),
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    let errorMessage = null;
    // console.log(`error`, error);
    // console.log(`error`, error.response);
    dispatch({ type: SEEN_ALL_NOTIFICATIONS_ERROR, payload: { error } });
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      if (typeof message === 'string') errorMessage = message;
      else if (typeof message === 'object')
        errorMessage = formatErrorMessage(message);
    }
    toast({
      title: capitalize(errorMessage || 'failed to seen all notification'),
      position: 'top',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};
