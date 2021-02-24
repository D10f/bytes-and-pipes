import { SET_PASSWORD, TOGGLE_VISIBILITY } from '../actionTypes';

const initialState = {
  password: '',
  showPassword: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PASSWORD:
      return {
        ...state,
        password: action.payload
      };
    case TOGGLE_VISIBILITY:
      return {
        ...state,
        showPassword: !state.showPassword
      };
    default:
      return state;
  }
};
