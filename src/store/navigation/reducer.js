import { RESET_CURRENT_ACTIVE, SET_CURRENT_ACTIVE } from './action';

const initialState = {
  currentActive: null,
};

export default function navigationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_ACTIVE:
      return {
        ...state,
        currentActive: action.payload.currentActive,
      };
    case RESET_CURRENT_ACTIVE: {
      return { ...state, ...initialState };
    }
    default:
      return state;
  }
}
