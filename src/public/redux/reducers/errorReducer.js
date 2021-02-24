import { SET_ERROR } from '../actionTypes';

const initialState = '';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return action.payload;
    default:
      return state;
  }
};
