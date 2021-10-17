import axios from 'axios';

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/gyra/v1'
    : 'http://139.180.196.41:5555/gyra/v1';

export const BASEAUTH_USER = 'admin';
export const BASEAUTH_PASSWORD = '123456';

const AUTH_ROUTE = '/auth';
const PROJECT_ROUTE = '/project';

export const AUTH_API = {
  register: `${AUTH_ROUTE}/register`,
  login: `${AUTH_ROUTE}/login`,
  getCurrent: `${AUTH_ROUTE}/getCurrent`,
};

export const PROJECT_API = {
  createProject: `${PROJECT_ROUTE}/create-project`,
  getProjects: `${PROJECT_ROUTE}`,
};

export const apiClient = axios.create({
  baseURL,
});

export const fileUri = filename => `${baseURL}/file/${filename}`;
