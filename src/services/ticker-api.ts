import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IPayloadAction, SessionActions } from '../actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import * as Rx from 'rxjs/Rx';

const BASE_URL = '/api';

@Injectable()
export class TickerApi {
  constructor(private http: Http) {
  }

  public fetchCurrentPrice(previousPrice) {
    // TODO : When we hook it up to actual API, do it here with rest
    return Rx.Observable.from([1])
      .map((response) => this.transformTicker(response, previousPrice));
  }

  private transformTicker(response, previousPrice) {
    return this.mockTransform(previousPrice);
  }

  private mockTransform(previousPrice) {
    let nextPrice = previousPrice + this.getIncrement();
    if (nextPrice < 1) {
      return 2;
    }
    return nextPrice;
  }

  private getIncrement() {
    let increment = Math.round(Math.random());
    if (increment === 0) {
      return -1;
    }
    return 1;
  }
}
