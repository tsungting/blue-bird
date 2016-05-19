///<reference path="./dev-types.d.ts"/>

import { Map, fromJS } from 'immutable';
const persistState = require('redux-localstorage');
import logger from './configure-logger';

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

export const middleware = __DEV__ ? [ logger ] : [];

export const enhancers = __DEV__ && window.devToolsExtension ?
  [ ...baseEnhancers, window.devToolsExtension() ] :
  baseEnhancers;
