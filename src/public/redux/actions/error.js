import { SET_ERROR } from '../actionTypes';

export const setError = (errorMsg = '') => ({
  type: SET_ERROR,
  payload: errorMsg
});
