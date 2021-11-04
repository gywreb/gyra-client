import {
  RESET_CURRENT_ACTIVE,
  RESET_CURRENT_SIDEBAR_ACTIVE,
  SET_CURRENT_ACTIVE,
  SET_CURRENT_SIDEBAR_ACTIVE,
} from './action';

const initialState = {
  currentActive: null,
  currentSidebarActive: null,
};

export default function navigationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_ACTIVE:
      return {
        ...state,
        currentActive: action.payload.currentActive,
      };
    case RESET_CURRENT_ACTIVE: {
      return { ...state, currentActive: null };
    }
    case SET_CURRENT_SIDEBAR_ACTIVE: {
      return { ...state, currentSidebarActive: action.payload.currentActive };
    }
    case RESET_CURRENT_SIDEBAR_ACTIVE: {
      return { ...state, currentSidebarActive: null };
    }
    default:
      return state;
  }
}
