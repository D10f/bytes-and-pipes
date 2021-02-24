import { SET_FILE } from '../actionTypes';

export const setFile = (file = {}) => ({
  type: SET_FILE,
  payload: file
});
