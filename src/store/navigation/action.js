export const SET_CURRENT_ACTIVE = '@NAVIGATION/SET_CURRENT_ACTIVE';
export const RESET_CURRENT_ACTIVE = '@NAVIGATION/RESET_CURRENT_ACTIVE';
export const SET_CURRENT_SIDEBAR_ACTIVE =
  '@NAVIGATION/SET_CURRENT_SIDEBAR_ACTIVE';
export const RESET_CURRENT_SIDEBAR_ACTIVE =
  '@NAVIGATION/RESET_CURRENT_SIDEBAR_ACTIVE';

export const setCurrentActive = currentActive => dispatch => {
  dispatch({ type: SET_CURRENT_ACTIVE, payload: { currentActive } });
};

export const setCurrentSidebarActive = currentActive => dispatch => {
  dispatch({ type: SET_CURRENT_SIDEBAR_ACTIVE, payload: { currentActive } });
};
