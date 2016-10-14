import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RioContainer } from '../components';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import {Evolution} from '../types/evolution';
import {AnalysisAggregate} from '../types/analysis-aggregate';
import {NTierTreeResult} from '../types/n-tier-tree-result';
import {Goal} from '../types/goal';
import * as Rx from 'rxjs/Rx';
import {TickerActions} from '../actions/ticker.actions';

@Component({
  selector: 'bb-n-tier-simulation-page',
  template: `
     <rio-container [size]=4 [center]=true>
      <div class="col col-12 center">
        <div>
          <div style="max-height:75vh; overflow:scroll">
            <h2 class="caps">Run Exhaustively Over N-level Tree</h2>

              <div *ngIf="average" class="overflow-hidden border rounded m2">
                <div class="p1 clearfix bold white bg-blue">
                  <div class="col col-">
                    Average
                  </div>
                  <div class="col col-3">
                    Pool Depth: {{average.queryInfo.pool}}
                  </div>
                  <div class="col col-3">
                    Action Percentage: {{average.queryInfo.actionPoint * 100}}%
                  </div>
                </div>
                <div class="p2">
                  <div class="col col-3"><bb-label title="Avg Stock Held" [content]="average.averageStockHeld"></bb-label></div>
                  <div class="col col-3"><bb-label title="Stock Analyzed" [content]="average.totalStocksAnalyzed"></bb-label></div>
                  <div class="col col-3"><bb-label title="Wins Over Reference" [content]="getWinMessage(average)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Algorithm VS Reference" [content]="getPercentageGain(average)"></bb-label></div>
                </div>
              </div>

              <div *ngFor="let result of results">
              <div class="overflow-hidden border rounded m2">
                <div class="p1 clearfix bold white bg-blue">
                  <div class="col col-6">
                    {{result.pricesAnalyzed}}
                  </div>
                  <div class="col col-3">
                    Pool Depth: {{result.analysisResult.queryInfo.pool}}
                  </div>
                  <div class="col col-3">
                    Action Percentage: {{result.analysisResult.queryInfo.actionPoint * 100}}%
                  </div>
                </div>
                <div class="p2">
                  <div class="col col-3"><bb-label title="Avg Stock Held" [content]="result.analysisResult.averageStockHeld"></bb-label></div>
                  <div class="col col-3"><bb-label title="Start Price" [content]="formatCurrency(result.analysisResult.startPrice)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Maximum Profit" [content]="formatCurrency(result.analysisResult.maximumProfit)"></bb-label></div>
                  <div class="col col-3"><bb-label title="End Profit" [content]="formatCurrency(result.analysisResult.endProfit)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Minimum Cashflow" [content]="formatCurrency(result.analysisResult.minimumCashflow)"></bb-label></div>
                  <div class="col col-3"><bb-label title="End Price" [content]="formatCurrency(result.analysisResult.endPrice)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Minimum Profit" [content]="formatCurrency(result.analysisResult.minimumProfit)"></bb-label></div>
                  <div class="col col-3"><bb-label title="Algorithm VS Reference" [content]="getPercentageGain(result.analysisResult)"></bb-label></div>
                </div>
              </div>

            </div>

          </div>
          <footer class="absolute bottom-0 m3">
            <span>Run simulation for Dataset #</span>
            <input type="text" placeholder="Tree Depth" [(ngModel)]="treeDepth">
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
export class NTierSimulationPage {
  @select(state => state.ticker.get('nTierTreeResults')) private nTierTreeResults$;
  @select(state => state.ticker.get('nTierTreeAverage')) private nTierTreeAverage$;

  private isLoading: boolean = false;
  private treeDepth: string = '10';
  private actionPoint: string = '0.01';
  private stockPool: string = '3';
  private results: Array<NTierTreeResult> = [];
  private average: AnalysisAggregate = null;

  constructor(private tickerActions: TickerActions) {
  }

  ngOnInit() {
    this.nTierTreeResults$
      .filter((value) => value)
      .map((value) => value.toJS())
      .subscribe((results) => {
        this.results = results;
      });

    this.nTierTreeAverage$
      .filter((value) => value)
      .map((value) => value.toJS())
      .subscribe((average) => {
        this.average = average;
      });
  }

  private getPercentageGain(average: AnalysisAggregate) {
    return `${(average.percentageGain * 100).toFixed(2)}% vs ${(average.referenceGain * 100).toFixed(2)}% `;
  }

  private formatCurrency(number) {
    return `$ ${number.toFixed(2)}`;
  }

  public analyzeStock() {
    this.tickerActions.analyzeNTierTree(parseInt(this.treeDepth, 10), parseFloat(this.actionPoint), parseInt(this.stockPool, 10));
  }

  private getWinMessage(average: AnalysisAggregate) {
    return `${average.totalWinOverReference} (${(average.totalWinOverReference * 100 / average.totalStocksAnalyzed).toFixed(2)}%)`;
  }
}
