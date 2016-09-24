import { combineReducers } from 'redux';
import { routerReducer } from 'ng2-redux-router';
import * as counter from './counter';
import * as session from './session';
import * as TickerReducer from './ticker/ticker.reducer';
import * as Immutable from 'immutable';

export interface IAppState {
  counter?: counter.ICounter;
  session?: session.ISession;
  ticker?: any;
};

export const rootReducer = combineReducers<IAppState>({
  counter: counter.counterReducer,
  session: session.sessionReducer,
  ticker: TickerReducer.tickerReducer,
  router: routerReducer,
});

export function deimmutify(store) {
  return {
    counter: store.counter.toJS(),
    session: store.session.toJS(),
    router: store.router,
    ticker: store.ticker.toJS()
  };
}

export function reimmutify(plain) {
  return {
    counter: counter.CounterFactory(plain.counter),
    session: session.SessionFactory(plain.session),
    router: plain.router,
    ticker: plain.ticker
  };
}
