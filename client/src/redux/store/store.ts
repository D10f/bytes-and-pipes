import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import errorReducer from '@redux/reducers/errorReducer';
import urlReducer from '@redux/reducers/urlReducer';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = compose;

const rootReducer = combineReducers({
  error: errorReducer,
  url: urlReducer,
});

const middleware = [ thunk ];

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
