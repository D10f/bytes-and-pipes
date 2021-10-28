import { ErrorActions, IErrorAction } from '@redux/types';

const initialState = '';

export default (state = initialState, action: IErrorAction) => {
  switch (action.type) {
    case ErrorActions.SET_ERROR:
      return action.payload;
    default:
      return state;
  }
};
