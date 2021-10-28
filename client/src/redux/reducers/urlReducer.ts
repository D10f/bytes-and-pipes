import { UrlActions, IUrlAction } from '@redux/types';

const initialState = '';

export default (state = initialState, action: IUrlAction) => {
  switch (action.type) {
    case UrlActions.SET_URL:
      return action.payload;
    default:
      return state;
  }
};
