import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../store';
import {TickerActions} from '../actions/ticker.actions';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class TickerTimer {

  constructor ( private tickerAction: TickerActions ) {
  }

  public startTickers() {
    Rx.Observable.timer(1000, 1000)
      .take(10)
      .subscribe((value) => {
        this.tickerAction.getTickerValue();
      });
  }
}
