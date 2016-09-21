import { Action } from 'redux';
import { TickerActions } from '../../actions/ticker.actions';

export const INITIAL_STATE = {
  currentTicker: 10
};

export function tickerReducer(state = INITIAL_STATE,
                              action) {

  switch (action.type) {

    case TickerActions.TICKER_UPDATED:
      return {currentTicker: action.payload};

    default:
      return state;
  }
}
