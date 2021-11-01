import { ActionTypes, SetErrorAction } from './types';

const initialState = '';

export default (state = initialState, action: SetErrorAction) => {
  switch (action.type) {
    case ActionTypes.SET_ERROR:
      return action.payload;
    default:
      return state;
  }
};
