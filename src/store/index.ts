import { IAppState, rootReducer, deimmutify, reimmutify } from './store';
import { ICounter } from './counter';
import { ISession } from './session';
import * as Immutable from 'immutable';

import {dev} from '../configuration';

const createLogger = require('redux-logger');
const persistState = require('redux-localstorage');
const makeImmutable = store => next => action => {
  if (typeof action.payload === 'object') {
    let json = JSON.parse(JSON.stringify(action.payload));
    action.payload = Immutable.fromJS(json);
  }
  next(action);
};
export {
  IAppState,
  ISession,
  ICounter,
  rootReducer,
  reimmutify,
};

export let middleware = [];
export let enhancers = [];

if (dev) {
  middleware.push(
    makeImmutable,
    createLogger({
      level: 'info',
      collapsed: true,
      stateTransformer: deimmutify,
      actionTransformer: (action) => {
        if (typeof action.payload !== 'object') {
          return action;
        }
        return {
          type: action.type,
          payload: action.payload.toJS()
        };
      }
    })
  );

  const environment: any = window || this;
  if (environment.devToolsExtension) {
    enhancers.push(environment.devToolsExtension());
  }
}
