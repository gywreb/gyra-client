import { capitalize } from 'lodash';
import {
  apiClient,
  AUTH_API,
  BASEAUTH_PASSWORD,
  BASEAUTH_USER,
} from 'src/configs/api';
import { ROUTE_KEY } from 'src/configs/router';

// - REGISTER
export const REGISTER_REQUEST = '@AUTH/REGISTER_REQUEST';
export const REGISTER_SUCCESS = '@AUTH/REGISTER_SUCCESS';
export const REGISTER_ERROR = '@AUTH/REGISTER_ERROR';

// -LOGIN
export const LOGIN_REQUEST = '@AUTH/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@AUTH/LOGIN_SUCCESS';
export const LOGIN_ERROR = '@AUTH/LOGIN_ERROR';

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
        position: 'top-right',
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
        title: capitalize(error.response?.data?.message || 'Register Error'),
        status: 'error',
        position: 'top-right',
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
      position: 'top-right',
      isClosable: true,
      duration: 3000,
    });
    resetForm();
    history.replace({
      pathname: ROUTE_KEY.Home,
    });
  } catch (error) {
    console.log(error);
    toast({
      title: capitalize(error.response?.data?.message || 'Login Error'),
      status: 'error',
      position: 'top-right',
      isClosable: true,
      duration: 3000,
    });
    dispatch({ type: LOGIN_ERROR, payload: { error } });
  }
};
