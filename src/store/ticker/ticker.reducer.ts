import { Action } from 'redux';
import { TickerActions } from '../../actions/ticker.actions';
import {Evolution} from '../../types/evolution';
import * as Immutable from 'immutable';

export const INITIAL_STATE = Immutable.fromJS({
  currentTicker: 10,
  evolutions: [JSON.parse(JSON.stringify(new Evolution()))],
  webEvolutions: [],
  stockAnalysisResult: [],
  multiStockAnalysisResult: [],
  stockList: {}
});

export function tickerReducer(state = INITIAL_STATE,
                              action: any = {}) {

  switch (action.type) {

    case TickerActions.TICKER_UPDATED:
      return state.set('currentTicker', action.payload);
    case TickerActions.NEW_EVOLUTION_CREATED:
      return state.update('evolutions', (evolutions) => evolutions.push(action.payload));
    case TickerActions.NEW_STOCK_LIST_CREATED:
      return state.setIn(['stockList', action.payload.get('page')], action.payload.get('list'));
    case TickerActions.NEW_WEB_EVOLUTION_CREATED:
      state = state.set('webApiStatus', 'Success');
      return state.update('webEvolutions', (evolutions) => evolutions.push(action.payload));
    case TickerActions.NEW_ANALYSIS_RESULT_CREATED:
      state = state.set('webApiStatus', 'Success');
      return state.update('stockAnalysisResult', (results) => results.push(action.payload));
    case TickerActions.MULTI_STOCK_ANALYSIS_RESULT_CREATED:
      state = state.set('webApiStatus', 'Success');
      return state.update('multiStockAnalysisResult', (results) => results.push(action.payload));
    case TickerActions.WEB_REQUEST_STARTED:
      state = state.set('webEvolutions', Immutable.fromJS([]));
      return state.set('webApiStatus', 'Loading');
    case TickerActions.NOT_FOUND_RECEIVED:
      return state.set('webApiStatus', 'Not Found');
    case TickerActions.N_TIER_TREE_RESULTS_CREATED:
          return state.set('nTierTreeResults', action.payload);
    case TickerActions.N_TIER_TREE_AVERAGE_CREATED:
          return state.set('nTierTreeAverage', action.payload);
    default:
      return state;
  }
}
