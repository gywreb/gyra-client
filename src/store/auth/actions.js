import { capitalize } from 'lodash';
import {
  apiClient,
  AUTH_API,
  BASEAUTH_PASSWORD,
  BASEAUTH_USER,
} from 'src/configs/api';
import { ROUTE_KEY } from 'src/configs/router';
import { NAVIGATION_KEY } from '../../configs/navigation';
import { SET_CURRENT_ACTIVE } from '../navigation/action';

// - REGISTER
export const REGISTER_REQUEST = '@AUTH/REGISTER_REQUEST';
export const REGISTER_SUCCESS = '@AUTH/REGISTER_SUCCESS';
export const REGISTER_ERROR = '@AUTH/REGISTER_ERROR';

// -LOGIN
export const LOGIN_REQUEST = '@AUTH/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@AUTH/LOGIN_SUCCESS';
export const LOGIN_ERROR = '@AUTH/LOGIN_ERROR';

// - GET CURRENT
export const GET_CURRENT_REQUEST = '@AUTH/GET_CURRENT_REQUEST';
export const GET_CURRENT_SUCCESS = '@AUTH/GET_CURRENT_SUCCESS';
export const GET_CURRENT_ERROR = '@AUTH/GET_CURRENT_ERROR';

export const registerAccount =
  (params, history, toast, resetForm) => async dispatch => {
    dispatch({ type: REGISTER_REQUEST });
    try {
      const {
        data: {
          data: { newUser },
        },
      } = await apiClient.post(AUTH_API.register, params, {
        auth: {
          username: BASEAUTH_USER,
          password: BASEAUTH_PASSWORD,
        },
      });
      dispatch({ type: REGISTER_SUCCESS });
      toast({
        title: capitalize('you have successfully sign up'),
        status: 'success',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
      resetForm();
      history.replace({
        pathname: ROUTE_KEY.Login,
        search: `?username=${newUser.username}`,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.data?.message || 'Register Error',
        status: 'error',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
      dispatch({ type: REGISTER_ERROR, payload: { error } });
    }
  };

export const login = (params, history, toast, resetForm) => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const {
      data: {
        data: { token, userInfo },
      },
    } = await apiClient.post(AUTH_API.login, params, {
      auth: {
        username: BASEAUTH_USER,
        password: BASEAUTH_PASSWORD,
      },
    });
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('jwt', token);
    dispatch({ type: LOGIN_SUCCESS, payload: { token, userInfo } });
    toast({
      title: `Welcome back ${params.username}!`,
      status: 'success',
      position: 'top',
      isClosable: true,
      duration: 3000,
    });
    resetForm();
    history.replace({
      pathname: ROUTE_KEY.Home,
    });
    dispatch({
      type: SET_CURRENT_ACTIVE,
      payload: { currentActive: NAVIGATION_KEY.PROJECT },
    });
  } catch (error) {
    console.log(error);
    toast({
      title: error.response?.data?.message || 'Login Error',
      status: 'error',
      position: 'top',
      isClosable: true,
      duration: 3000,
    });
    dispatch({ type: LOGIN_ERROR, payload: { error } });
  }
};

export const getCurrent = (history, toast, currentPath) => async dispatch => {
  delete apiClient.defaults.headers.common['Authorization'];
  dispatch({ type: GET_CURRENT_REQUEST });
  const token = localStorage.getItem('jwt');
  try {
    const {
      data: {
        data: { userInfo },
      },
    } = await apiClient.get(AUTH_API.getCurrent, {
      headers: { Authorization: `Bearer ${token}` },
    });
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('jwt', token);
    // toast({
    //   title: `Welcome back ${userInfo.username}!`,
    //   position: 'top',
    //   status: 'success',
    //   duration: 3000,
    //   isClosable: true,
    // });
    dispatch({ type: GET_CURRENT_SUCCESS, payload: { userInfo, token } });
    if (currentPath) {
      dispatch({
        type: SET_CURRENT_ACTIVE,
        payload: { currentActive: currentPath },
      });
      history.push(currentPath);
    } else {
      dispatch({
        type: SET_CURRENT_ACTIVE,
        payload: { currentActive: NAVIGATION_KEY.PROJECT },
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_CURRENT_ERROR,
      payload: { error: error?.response?.data || 'error' },
    });
    history.push(ROUTE_KEY.Login);
  }
};
