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
    let interval = 100;
    let iteration = 200;
    Rx.Observable.timer(interval, interval)
      .take(iteration)
      .subscribe((value) => {
        this.tickerAction.getTickerValue();
      });
  }
}
