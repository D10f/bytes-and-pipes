import { SET_FILE } from '../actionTypes';

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FILE:
      return action.payload
    default:
      return state;
  }
};
