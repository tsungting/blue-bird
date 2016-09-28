import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import {TickerApi} from '../services/ticker-api';
import {Goal} from '../types/goal';
import {Evolution} from '../types/evolution';

import {RandomTickerEvolutionGenerator} from '../services/random-ticker-evolution-generator';
import {WebTickerEvolutionGenerator} from '../services/web-ticker-evolution-generator';

@Injectable()
export class TickerActions {
  static TICKER_UPDATED = 'TICKER_UPDATED';
  static NEW_EVOLUTION_CREATED = 'NEW_EVOLUTION_CREATED';
  static WEB_REQUEST_STARTED = 'WEB_REQUEST_STARTED';
  static NEW_WEB_EVOLUTION_CREATED = 'NEW_WEB_EVOLUTION_CREATED';

  constructor(private ngRedux: NgRedux<IAppState>,
              private tickerApi: TickerApi) {
  }

  public getTickerValue() {
    let state = this.ngRedux.getState();
    this.tickerApi.fetchNextRandomPrice(state.ticker.get('currentTicker'))
      .subscribe((ticker) => {
        state = this.ngRedux.getState();
        let generator = new RandomTickerEvolutionGenerator();
        let evolution = generator.getEvolution(ticker, state.ticker.get('evolutions').toJS());
        if (evolution) {
          this.dispatchEvolution(evolution, TickerActions.NEW_EVOLUTION_CREATED);
        }
        this.dispatchTicker(ticker);
      });
  }

  public getWebTicker(symbol = 'FB', actionPoint = '0.05', stockPool = '3') {
    this.ngRedux.dispatch({
      type: TickerActions.WEB_REQUEST_STARTED,
      payload: {symbol: symbol}
    });
    this.tickerApi.fetchHistoryFor(symbol)
      .subscribe((ticker) => {
        let state = this.ngRedux.getState();
        let generator = new WebTickerEvolutionGenerator(actionPoint, stockPool);
        let evolution = generator.getEvolution(ticker, state.ticker.get('webEvolutions').toJS());
        if (evolution) {
          this.dispatchEvolution(evolution, TickerActions.NEW_WEB_EVOLUTION_CREATED);
        }
        this.dispatchTicker(ticker);
      });
  }

  private dispatchEvolution(evolution, name) {
    this.ngRedux.dispatch({
      type: name,
      payload: evolution
    });
  }

  private dispatchTicker(ticker) {
    this.ngRedux.dispatch({
      type: TickerActions.TICKER_UPDATED,
      payload: ticker
    });
  }

}
