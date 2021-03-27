import { SET_URL } from '../actionTypes';

export const setUrl = (url = '') => ({
  type: SET_URL,
  payload: url
});
