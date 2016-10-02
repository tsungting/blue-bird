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
  selector: 'bb-multi-stock-analyzer-page',
  template: `
     <rio-container [size]=4 [center]=true>
      <div class="col col-12 center">
        <div>
          <div style="max-height:75vh; overflow:scroll">
            <h2 class="caps">Simulate</h2>

            <div *ngFor="let result of results">
              <div class="overflow-hidden border rounded m2">
                <div class="p1 clearfix bold white bg-blue">
                  <div class="col col-3">
                    {{result.queryInfo.symbol}}
                  </div>
                  <div class="col col-3">
                    Pool Depth: {{result.queryInfo.pool}}
                  </div>
                  <div class="col col-3">
                    Action Percentage: {{result.queryInfo.actionPoint * 100}}%
                  </div>
                </div>
                <div class="p2">
                  <div class="col col-3"><bb-label title="Avg Stock Held" [content]="result.averageStockHeld"></bb-label></div>
                  <div class="col col-3"><bb-label title="Start Price" [content]="formatCurrency(result.startPrice)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Maximum Profit" [content]="formatCurrency(result.maximumProfit)"></bb-label></div>
                  <div class="col col-3"><bb-label title="End Profit" [content]="formatCurrency(result.endProfit)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Minimum Cashflow" [content]="formatCurrency(result.minimumCashflow)"></bb-label></div>
                  <div class="col col-3"><bb-label title="End Price" [content]="formatCurrency(result.endPrice)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Minimum Profit" [content]="formatCurrency(result.minimumProfit)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Algorithm VS Reference" [content]="getPercentageGain(result)"></bb-label></div>
                </div>
              </div>

            </div>
          </div>
          <footer class="absolute bottom-0 m3">
            <span>Run simulation for </span>
            <input type="text" placeholder="Symbol" [(ngModel)]="symbol">
            <span> with a stock pool of </span>
            <input type="text" placeholder="Stocks to Hold" [(ngModel)]="stockPool">
            <span> and a action point of</span>
            <input type="text" placeholder="Decimal Percentage" [(ngModel)]="actionPoint">
            <button class="btn btn-primary" (click)="analyzeStock()">Analyze</button>
            <span *ngIf="isLoading">Loading...</span>
            <span *ngIf="status === 'Not Found'">Not Found</span>
          </footer>
        </div>
      </div>

    </rio-container>
  `
})
export class MultiStockAnalyzer {
  @select(state => state.ticker.get('stockAnalysisResult')) private analysisResult$;
  @select(state => state.ticker.get('webApiStatus')) private webApiStatus$;

  private isLoading: boolean = false;
  private symbol: string = 'FB';
  private actionPoint: string = '0.01';
  private stockPool: string = '3';
  private results: Array<AnalysisResult> = [];
  private status : string = '';

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
        this.status = status;
      });
  }

  private getPercentageGain(result: AnalysisResult) {
    return `${(result.percentageGain * 100).toFixed(2)}% vs ${(result.referenceGain * 100).toFixed(2)}% `;
  }

  private formatCurrency(number) {
    return `$ ${number.toFixed(2)}`;
  }

  public analyzeStock() {
    this.tickerActions.analyzeStock(this.symbol, this.actionPoint, this.stockPool);
  }
}
