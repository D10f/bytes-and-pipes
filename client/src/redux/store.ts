import { createStore, combineReducers } from 'redux';
import errorReducer from '@redux/errors/reducers';

// I might add new functionality in the future so I'll leave this in place.
const rootReducer = combineReducers({
  error: errorReducer
});

const initialState = {};

const store = createStore(
  rootReducer,
  initialState
);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>

export default store;
