import { SET_USER, LOGOUT } from '../actionTypes';

const initialState = {
  user: null,
  jwt: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
