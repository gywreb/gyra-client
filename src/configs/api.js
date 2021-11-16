import axios from 'axios';
import QueryString from 'qs';

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/gyra/v1'
    : 'http://139.180.196.41:5555/gyra/v1';

export const BASEAUTH_USER = 'admin';
export const BASEAUTH_PASSWORD = '123456';

const AUTH_ROUTE = '/auth';
const PROJECT_ROUTE = '/project';
const COLUMN_ROUTE = '/column';
const TASK_ROUTE = '/task';
const USER_ROUTE = '/user';

export const AUTH_API = {
  register: `${AUTH_ROUTE}/register`,
  login: `${AUTH_ROUTE}/login`,
  getCurrent: `${AUTH_ROUTE}/getCurrent`,
};

export const PROJECT_API = {
  createProject: `${PROJECT_ROUTE}/create-project`,
  getProjects: `${PROJECT_ROUTE}`,
};

export const COLUMN_API = {
  createColumn: `${COLUMN_ROUTE}/create-column`,
  getColumnByProject: projectId => `${COLUMN_ROUTE}/${projectId}`,
};

export const TASK_API = {
  createTask: `${TASK_ROUTE}/create-task`,
  getTaskListByProject: projectId => `${TASK_ROUTE}/${projectId}`,
  moveTaskInBoard: taskId => `${TASK_ROUTE}/move-task/${taskId}`,
  editTask: taskId => `${TASK_ROUTE}/edit-task/${taskId}`,
};

export const USER_API = {
  getAllUsers: `${USER_ROUTE}/all`,
};

export const apiClient = axios.create({
  baseURL,
  paramsSerializer: params =>
    QueryString.stringify(params, { arrayFormat: 'repeat' }),
});

export const fileUri = filename => `${baseURL}/file/${filename}`;
