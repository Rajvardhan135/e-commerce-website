import { createStore, compose, applyMiddleware } from 'redux'
import logger from 'redux-logger';
import { rootReducer } from './root-reducer'

const composedEnhancers = compose(applyMiddleware(logger))

export const store = createStore(rootReducer, undefined, undefined);
