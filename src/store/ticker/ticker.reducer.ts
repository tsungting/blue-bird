import { Action } from 'redux';
import { TickerActions } from '../../actions/ticker.actions';
import {Evolution} from '../../types/evolution';

export const INITIAL_STATE = {
  currentTicker: 10,
  evolutions: [new Evolution()]
};

export function tickerReducer(state = INITIAL_STATE,
                              action) {

  switch (action.type) {

    case TickerActions.TICKER_UPDATED:
      state.currentTicker = action.payload;
      return state;
    case TickerActions.NEW_EVOLUTION_CREATED:
      state.evolutions.push(action.payload);
      return state;
    default:
      return state;
  }
}
