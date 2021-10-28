import { ErrorActions } from '@redux/types';

export const setError = (errorMsg: string = '') => ({
  type: ErrorActions.SET_ERROR,
  payload: errorMsg
});
