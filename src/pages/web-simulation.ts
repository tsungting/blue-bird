import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RioContainer } from '../components';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import {Evolution} from '../types/evolution';
import {Goal} from '../types/goal';
import * as Rx from 'rxjs/Rx';
import {TickerActions} from '../actions/ticker.actions';

@Component({
  selector: 'bb-web-simulation-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
     <rio-container [size]=4 [center]=true>
      <div class="col col-12 center">
        <div>
          <h2 class="inline-block caps">Simulate</h2> <input type="text" placeholder="Company Symbol" [(ngModel)]="symbol">
        </div>
        <button class="btn btn-primary" (click)="startWebTicker()">Start</button>
        <span *ngIf="isLoading">Loading...</span>
      </div>
      <bb-label title="Current Ticker" [content]="ticker$ | async"></bb-label>

      <bb-evolution-log
        [evolutions]="evolutions"
      ></bb-evolution-log>
    </rio-container>
  `
})
export class WebSimulationPage {
  @select(state => state.ticker.get('currentTicker')) private ticker$;
  @select(state => state.ticker.get('webEvolutions')) private evolutions$;
  @select(state => state.ticker.get('webApiStatus')) private webApiStatus$;

  private evolutions: Array<Evolution> = [];
  private isLoading : boolean = false;
  private symbol: string = '';
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


  public startWebTicker() {
    this.tickerActions.getWebTicker(this.symbol);
  }
}
