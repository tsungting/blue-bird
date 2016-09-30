import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RioContainer } from '../components';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import {Evolution} from '../types/evolution';
import {Goal} from '../types/goal';
import * as Rx from 'rxjs/Rx';
import {TickerActions} from '../actions/ticker.actions';

@Component({
  selector: 'bb-web-analyzer-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
     <rio-container [size]=4 [center]=true>
      <div class="col col-12 center">
        <div>
          <h2 class="caps">Simulate</h2>
          <span>Run simulation for </span>
          <input type="text" placeholder="Symbol" [(ngModel)]="symbol">
          <span> with a stock pool of </span>
          <input type="text" placeholder="Stocks to Hold" [(ngModel)]="stockPool">
          <span> and a action point of</span>
          <input type="text" placeholder="Decimal Percentage" [(ngModel)]="actionPoint">
        </div>
        <button class="btn btn-primary" (click)="analyzeStock()">Analyze</button>
        <span *ngIf="isLoading">Loading...</span>
      </div>
      <bb-label title="Current Ticker" [content]="ticker$ | async"></bb-label>

      <bb-evolution-log
        [evolutions]="evolutions"
      ></bb-evolution-log>
    </rio-container>
  `
})
export class WebAnalyzerPage {
  @select(state => state.ticker.get('currentTicker')) private ticker$;
  @select(state => state.ticker.get('webEvolutions')) private evolutions$;
  @select(state => state.ticker.get('webApiStatus')) private webApiStatus$;

  private evolutions: Array<Evolution> = [];
  private isLoading : boolean = false;
  private symbol: string = '';
  private actionPoint: string = '';
  private stockPool: string = '';
  constructor(private tickerActions: TickerActions) {
  }

  ngOnInit() {
    this.evolutions$
      .filter((value) => value)
      .map((value) => value.toJS())
      .subscribe((evolutions) => {
        this.evolutions = evolutions.slice(1);
      });

    this.webApiStatus$
      .filter((value) => value)
      .subscribe((status) => {
        this.isLoading = status === 'Loading';
      });
  }


  public analyzeStock() {
    this.tickerActions.analyzeStock(this.symbol, this.actionPoint, this.stockPool);
  }
}
