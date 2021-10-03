import axios from 'axios';

export const baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000/gyra/v1' : '';

export const BASEAUTH_USER = 'admin';
export const BASEAUTH_PASSWORD = '123456';

const AUTH_ROUTE = '/auth';

export const AUTH_API = {
  register: `${AUTH_ROUTE}/register`,
  login: `${AUTH_ROUTE}/login`,
};

export const apiClient = axios.create({
  baseURL,
});

export const fileUri = filename => `${baseURL}/file/${filename}`;
