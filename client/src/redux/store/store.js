import { createStore, combineReducers, applyMiddleware,  compose } from 'redux';
import thunk from 'redux-thunk';
import errorReducer from '../reducers/errorReducer';
import urlReducer from '../reducers/urlReducer';
import userReducer from '../reducers/userReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  error: errorReducer,
  url: urlReducer,
  user: userReducer
});

const middleware = [ thunk ];

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
