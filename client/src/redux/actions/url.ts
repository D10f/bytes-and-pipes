import { UrlActions } from '@redux/types';

export const setUrl = (url: string = '') => ({
  type: UrlActions.SET_URL,
  payload: url
});
