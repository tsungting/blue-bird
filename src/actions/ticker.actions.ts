import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import {TickerApi} from '../services/ticker-api';

@Injectable()
export class TickerActions {
  static TICKER_UPDATED = 'TICKER_UPDATED';
  constructor(private ngRedux: NgRedux<IAppState>,
              private tickerApi : TickerApi,
  ) {}

  public getTickerValue() {
    let state = this.ngRedux.getState();
    this.tickerApi.fetchCurrentPrice(state.ticker.currentTicker)
      .subscribe((result) => {
        this.ngRedux.dispatch({
          type : TickerActions.TICKER_UPDATED,
          payload : result
        });
      });
  }

}
