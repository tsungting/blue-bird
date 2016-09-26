import { Action } from 'redux';
import { TickerActions } from '../../actions/ticker.actions';
import {Evolution} from '../../types/evolution';
import * as Immutable from 'immutable';

export const INITIAL_STATE = Immutable.fromJS({
  currentTicker: 10,
  evolutions: [JSON.parse(JSON.stringify(new Evolution()))],
  webEvolutions: [JSON.parse(JSON.stringify(new Evolution()))]
});

export function tickerReducer(state = INITIAL_STATE,
                              action) {

  switch (action.type) {

    case TickerActions.TICKER_UPDATED:
      return state.set('currentTicker', action.payload);
    case TickerActions.NEW_EVOLUTION_CREATED:
      return state.update('evolutions', (evolutions) => evolutions.push(action.payload));
    case TickerActions.NEW_WEB_EVOLUTION_CREATED:
      return state.update('webEvolutions', (evolutions) => evolutions.push(action.payload));
    default:
      return state;
  }
}
