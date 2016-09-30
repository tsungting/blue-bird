import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RioContainer } from '../components';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import {Evolution} from '../types/evolution';
import {AnalysisResult} from '../types/analysis-result';
import {Goal} from '../types/goal';
import * as Rx from 'rxjs/Rx';
import {TickerActions} from '../actions/ticker.actions';

@Component({
  selector: 'bb-web-analyzer-page',
  template: `
     <rio-container [size]=4 [center]=true>
      <div class="col col-12 center">
        <div>
          <h2 class="caps">Simulate</h2>
          <div *ngFor="let result of results">
            <bb-label title="End Price" [content]="result.endPrice"></bb-label>
          </div>
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

    </rio-container>
  `
})
export class WebAnalyzerPage {
  @select(state => state.ticker.get('stockAnalysisResult')) private analysisResult$;
  @select(state => state.ticker.get('webApiStatus')) private webApiStatus$;

  private isLoading : boolean = false;
  private symbol: string = '';
  private actionPoint: string = '';
  private stockPool: string = '';
  private results : Array<AnalysisResult> = [];
  constructor(private tickerActions: TickerActions) {
  }

  ngOnInit() {
    this.analysisResult$
      .filter((value) => value)
      .map((value) => value.toJS())
      .subscribe((results) => {
        this.results = results;
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
