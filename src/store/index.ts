///<reference path="./dev-types.d.ts"/>

import { Map, fromJS } from 'immutable';
import logger from './configure-logger';
import promiseMiddleware from '../middleware/promise-middleware';

const persistState = require('redux-localstorage');
const ReduxThunk = require('redux-thunk').default;

const baseMiddleware = [ 
  promiseMiddleware,
  ReduxThunk
];

const baseEnhancers = [
  persistState('session', {
    key: 'angular2-redux-seed',
    serialize: (store) => {
      return store && store.session ?
        JSON.stringify(store.session.toJS()) : store;
    },
    deserialize: (state) => ({
      session: state ? fromJS(JSON.parse(state)) : fromJS({}),
    }),
  })
];

export interface IAppState {
  counter?: Map<string, number>;
  session?: Map<string, any>;
};

export const middleware = __DEV__ ?
  [ ...baseMiddleware, logger ] :
  baseMiddleware;

export const enhancers = __DEV__ ?
  [ ...baseEnhancers, window.devToolsExtension() ] :
  baseEnhancers;
