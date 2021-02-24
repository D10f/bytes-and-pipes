import { SET_PASSWORD, TOGGLE_VISIBILITY } from '../actionTypes';

export const setPassword = (password = '') => ({
  type: SET_PASSWORD,
  payload: password
});

export const toggleVisibility = () => ({
  type: TOGGLE_VISIBILITY
});
