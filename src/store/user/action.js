import { capitalize } from 'lodash';
import { apiClient, USER_API } from 'src/configs/api';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';

export const GET_ALL_USER_REQUEST = '@USER/GET_ALL_USER_REQUEST';
export const GET_ALL_USER_SUCCESS = '@USER/GET_ALL_USER_SUCCESS';
export const GET_ALL_USER_ERROR = '@USER/GET_ALL_USER_ERROR';

export const getAllUser =
  (perPage, page, toast, isLoadMore) => async dispatch => {
    isLoadMore
      ? dispatch({ type: GET_ALL_USER_REQUEST, payload: { isLoadMore } })
      : dispatch({
          type: GET_ALL_USER_REQUEST,
          payload: { isLoadMore: false },
        });
    try {
      const {
        data: { data },
      } = await apiClient.get(USER_API.getAllUsers, {
        params: { perPage, page },
      });
      if (isLoadMore) {
        dispatch({
          type: GET_ALL_USER_SUCCESS,
          payload: {
            currentUserList: data.userList.docs,
            currentTotalPage: data.userList.totalPages,
            isLoadMore,
          },
        });
      } else {
        dispatch({
          type: GET_ALL_USER_SUCCESS,
          payload: {
            currentUserList: data.userList.docs,
            currentTotalPage: data.userList.totalPages,
            isLoadMore: null,
          },
        });
      }
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
          errorMessage || 'failed to fetch users data from server!'
        ),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      dispatch({ type: GET_ALL_USER_ERROR, payload: { error } });
    }
  };
