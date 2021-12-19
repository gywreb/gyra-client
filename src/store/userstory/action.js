import { capitalize } from 'lodash';
import { apiClient, USERSTORY_API } from 'src/configs/api';
import { formatErrorMessage } from 'src/utils/formatErrorMessage';
import { GET_PROJECT_DETAIL_SUCCESS } from '../project/action';

// GET USER STORIES
export const GET_USER_STORIES_REQUEST = '@USERSTORY/GET_USER_STORIES_REQUEST';
export const GET_USER_STORIES_SUCCESS = '@USERSTORY/GET_USER_STORIES_SUCCESS';
export const GET_USER_STORIES_ERROR = '@USERSTORY/GET_USER_STORIES_ERROR';

// CREATE USER STORY
export const CREATE_USER_STORY_REQUEST = '@USERSTORY/CREATE_USER_STORY_REQUEST';
export const CREATE_USER_STORY_SUCCESS = '@USERSTORY/CREATE_USER_STORY_SUCCESS';
export const CREATE_USER_STORY_ERROR = '@USERSTORY/CREATE_USER_STORY_ERROR';

export const getUserStoryList = (projectId, toast) => async dispatch => {
  dispatch({
    type: GET_USER_STORIES_REQUEST,
  });
  try {
    const {
      data: {
        data: { userStoryList, lastUserStoryKey, currentProject },
      },
    } = await apiClient.get(USERSTORY_API.getUserStories(projectId));

    dispatch({
      type: GET_PROJECT_DETAIL_SUCCESS,
      payload: { currentProject },
    });
    dispatch({
      type: GET_USER_STORIES_SUCCESS,
      payload: {
        currentUserStoryList: userStoryList,
        lastUserStoryKey,
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
    dispatch({ type: GET_USER_STORIES_ERROR, payload: { error } });
  }
};

export const createUserStory =
  (params, toast, closeModalOnSuccess) => async dispatch => {
    dispatch({ type: CREATE_USER_STORY_REQUEST });
    try {
      const {
        data: {
          data: { newUserStory },
        },
      } = await apiClient.post(USERSTORY_API.createUserStory, params);
      dispatch({ type: CREATE_USER_STORY_SUCCESS, payload: { newUserStory } });
      if (closeModalOnSuccess) closeModalOnSuccess();
      toast({
        title: 'Successfully create User Story',
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
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
        title: capitalize(errorMessage || 'failed to create user story!'),
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      dispatch({ type: CREATE_USER_STORY_ERROR, payload: { error } });
    }
  };
