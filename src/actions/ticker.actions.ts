import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import {TickerApi} from '../services/ticker-api';
import {Goal} from '../types/goal';
import {Evolution} from '../types/evolution';

import {RandomTickerEvolutionGenerator} from '../services/random-ticker-evolution-generator';

@Injectable()
export class TickerActions {
  static TICKER_UPDATED = 'TICKER_UPDATED';
  static NEW_EVOLUTION_CREATED = 'NEW_EVOLUTION_CREATED';

  constructor(private ngRedux: NgRedux<IAppState>,
              private tickerApi: TickerApi) {
  }

  public getTickerValue() {
    let state = this.ngRedux.getState();
    this.tickerApi.fetchNextRandomPrice(state.ticker.get('currentTicker'))
      .subscribe((ticker) => {
        let generator = new RandomTickerEvolutionGenerator();
        let evolution = generator.getEvolution(ticker, state.ticker.get('evolutions').toJS());
        if (evolution) {
          this.ngRedux.dispatch({
            type: TickerActions.NEW_EVOLUTION_CREATED,
            payload: evolution
          });
        }
        this.ngRedux.dispatch({
          type: TickerActions.TICKER_UPDATED,
          payload: ticker
        });
      });
  }

  public getWebTicker() {
    this.tickerApi.fetchHistoryFor('FB')
      .subscribe((ticker) => {
        console.log(ticker);
      });
  }


}
