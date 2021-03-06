import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RioContainer } from '../components';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import {Evolution} from '../types/evolution';
import {AnalysisAggregate} from '../types/analysis-aggregate';
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
            <h2 class="caps">Run 100 Stocks at Once</h2>

            <div *ngFor="let result of results">
              <div class="overflow-hidden border rounded m2">
                <div class="p1 clearfix bold white bg-blue">
                  <div class="col col-3">
                    Data Set # {{result.queryInfo.datasetNumber}}
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
                  <div class="col col-3"><bb-label title="Stock Analyzed" [content]="result.totalStocksAnalyzed"></bb-label></div>
                  <div class="col col-3"><bb-label title="Wins Over Reference" [content]="getWinMessage(result)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Algorithm VS Reference" [content]="getPercentageGain(result)"></bb-label></div>
                </div>
              </div>

            </div>
          </div>
          <footer class="absolute bottom-0 m3">
            <span>Run simulation for Dataset #</span>
            <input type="text" placeholder="Data set" [(ngModel)]="dataSetNumber">
            <span> with a stock pool of </span>
            <input type="text" placeholder="Stocks to Hold" [(ngModel)]="stockPool">
            <span> and a action point of</span>
            <input type="text" placeholder="Decimal Percentage" [(ngModel)]="actionPoint">
            <button class="btn btn-primary" (click)="analyzeStock()">Go!</button>
            <span *ngIf="isLoading">Loading...</span>
            <span *ngIf="status === 'Not Found'">Not Found</span>
          </footer>
        </div>
      </div>

    </rio-container>
  `
})
export class MultiStockAnalyzer {
  @select(state => state.ticker.get('multiStockAnalysisResult')) private analysisResult$;
  @select(state => state.ticker.get('webApiStatus')) private webApiStatus$;

  private isLoading: boolean = false;
  private dataSetNumber: string = '1';
  private actionPoint: string = '0.01';
  private stockPool: string = '3';
  private results: Array<AnalysisAggregate> = [];
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

  private getPercentageGain(result: AnalysisAggregate) {
    return `${(result.percentageGain * 100).toFixed(2)}% vs ${(result.referenceGain * 100).toFixed(2)}% `;
  }

  private formatCurrency(number) {
    return `$ ${number.toFixed(2)}`;
  }

  public analyzeStock() {
    this.tickerActions.analyzeMultiStock(this.dataSetNumber, parseFloat(this.actionPoint), parseInt(this.stockPool, 10));
  }

  private getWinMessage(result: AnalysisAggregate) {
    return `${result.totalWinOverReference} (${(result.totalWinOverReference * 100 / result.totalStocksAnalyzed).toFixed(2)}%)`;
  }
}
