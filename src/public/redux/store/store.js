import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import fileReducer from '../reducers/fileReducer';
import passwordReducer from '../reducers/passwordReducer';
import errorReducer from '../reducers/errorReducer';
import userReducer from '../reducers/userReducer';

const rootReducer = combineReducers({
  file: fileReducer,
  password: passwordReducer,
  error: errorReducer,
  user: userReducer
});

const middleware = [ thunk ];

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
