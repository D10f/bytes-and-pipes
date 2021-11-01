import { ActionTypes, SetErrorAction } from './types';

export const setError = (errorMsg = ''): SetErrorAction => ({
  type: ActionTypes.SET_ERROR,
  payload: errorMsg
});
