import { ROUTE_KEY } from './router';

export const NAVIGATION_KEY = {
  PROJECT: 'project',
  TASK: 'task',
  PEOPLE: 'people',
  TEAM: 'team',
};

export const APP_NAVIGATIONS = [
  {
    id: NAVIGATION_KEY.PROJECT,
    title: 'Projects',
    path: ROUTE_KEY.Projects,
  },
  {
    id: NAVIGATION_KEY.TASK,
    title: 'Tasks',
    path: ROUTE_KEY.Tasks,
  },
  {
    id: NAVIGATION_KEY.PEOPLE,
    title: 'People',
    path: ROUTE_KEY.People,
  },
  {
    id: NAVIGATION_KEY.TEAM,
    title: 'Team',
    path: ROUTE_KEY.Team,
  },
];
