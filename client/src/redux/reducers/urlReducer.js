import { SET_URL } from '../actionTypes';

const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_URL:
      return action.payload;
    default:
      return state;
  }
};
