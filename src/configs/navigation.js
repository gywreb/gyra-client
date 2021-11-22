import { HiOutlineViewBoards } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi';
import { ROUTE_KEY } from './router';
import { AiOutlineSchedule } from 'react-icons/ai';

export const NAVIGATION_KEY = {
  PROJECT: '/projects',
  TASK: '/tasks',
  PEOPLE: '/people',
  TEAM: '/team',
  BOARD: '/board',
  SETTING: '/setting',
  ACTIVITY: '/activity',
  INVITATION: '/invitation',
};

export const APP_NAVIGATIONS = [
  {
    id: NAVIGATION_KEY.PROJECT,
    title: 'Projects',
    path: ROUTE_KEY.Projects,
  },
  // {
  //   id: NAVIGATION_KEY.TASK,
  //   title: 'Tasks',
  //   path: ROUTE_KEY.Tasks,
  // },
  {
    id: NAVIGATION_KEY.PEOPLE,
    title: 'People',
    path: ROUTE_KEY.People,
  },
  // {
  //   id: NAVIGATION_KEY.TEAM,
  //   title: 'Team',
  //   path: ROUTE_KEY.Team,
  // },
];

export const sideBarNavItems = [
  {
    id: NAVIGATION_KEY.ACTIVITY,
    path: ROUTE_KEY.Activity,
    name: 'Main Activity',
    icon: AiOutlineSchedule,
  },
  {
    id: NAVIGATION_KEY.BOARD,
    path: ROUTE_KEY.Board,
    name: 'Task Board',
    icon: HiOutlineViewBoards,
  },
  {
    id: NAVIGATION_KEY.SETTING,
    path: ROUTE_KEY.Setting,
    name: 'Project Setting',
    icon: FiSettings,
  },
];
