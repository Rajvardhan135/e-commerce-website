import { createStore, compose, applyMiddleware } from 'redux'
import logger from 'redux-logger';
import { thunk } from 'redux-thunk';
import { rootReducer } from './root-reducer'

// Support Redux DevTools when available in the browser
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const middlewares = [thunk, logger];
const composedEnhancers = composeEnhancers(applyMiddleware(...middlewares));

export const store = createStore(rootReducer, undefined, composedEnhancers);
