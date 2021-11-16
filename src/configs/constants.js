import { FaArrowUp, FaCheck, FaPlus } from 'react-icons/fa';
import {
  FiChevronDown,
  FiChevronsDown,
  FiChevronsUp,
  FiChevronUp,
} from 'react-icons/fi';
import { TiEquals } from 'react-icons/ti';
import { IoMdBug } from 'react-icons/io';
import { MdArrowUpward } from 'react-icons/md';
import { RiTestTubeFill } from 'react-icons/ri';

export const USER_PER_PAGE = 12;

export const TASK_TYPES = ['feature', 'bug', 'improvement', 'test', 'request'];

export const TASK_TYPES_UI = {
  feature: { icon: FaPlus, color: '#38A169' },
  bug: { icon: IoMdBug, color: '#E53E3E' },
  improvement: { icon: FaArrowUp, color: '#805AD5' },
  test: { icon: RiTestTubeFill, color: '#00B5D8' },
  request: { icon: FaCheck, color: '#718096' },
};

export const TASK_TYPE_SELECT = TASK_TYPES.map(task => ({
  label: task,
  ...TASK_TYPES_UI[task],
}));

export const PRIORITY = ['highest', 'high', 'medium', 'low', 'lowest'];

export const PRIORITY_UI = {
  highest: {
    color: '#C53030',
    icon: FiChevronsUp,
  },
  high: {
    color: '#E53E3E',
    icon: FiChevronUp,
  },
  medium: {
    color: '#D69E2E',
    icon: TiEquals,
  },
  low: {
    color: '#3182CE',
    icon: FiChevronsDown,
  },
  lowest: {
    color: '#2B6CB0',
    icon: FiChevronDown,
  },
};

export const PRIORITY_SELECT = PRIORITY.map(priority => ({
  label: priority,
  ...PRIORITY_UI[priority],
}));

export const MEMBER_ROLES = ['leader', 'developer', 'tester', 'product'];

export const ATTACHMENT_TYPE = ['IMAGE', 'FILE'];
