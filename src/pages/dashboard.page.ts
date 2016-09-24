import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RioContainer } from '../components';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import {Evolution} from '../types/evolution';
import {Goal} from '../types/goal';

@Component({
  selector: 'rio-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <rio-container [size]=4 [center]=true>
      <h2 class="caps">Dashboard</h2>
      <p>
        Iterate over transactions and perform goal oriented buy/sell behaviour
      </p>
      <label>Current Ticker</label>
      <div>{{ticker$ | async}}</div>

      <div class="clearfix" *ngFor="let evolution of evolutions">
        <div class="col col-2">
          <bb-label title="Price" [content]="evolution.price"></bb-label>
        </div>
        <div class="col col-3">
          <bb-label title="Remaining Stocks"></bb-label>
          <div *ngFor="let stock of evolution.ownedStocks">
            <span class="border inline">{{stock}}</span>
          </div>
        </div>
        <div class="col col-3">
          <bb-label title="Goals"></bb-label>
          <div *ngFor="let goal of evolution.goals">
            <span class="border inline">{{getGoalMessage(goal)}}</span>
          </div>
        </div>
        <div class="col col-2">
          <bb-label title="Cashflow" [content]="evolution.cashflow"></bb-label>
        </div>
        <div class="col col-2">
          <bb-label title="Net Worth" [content]="getMarketValue(evolution)"></bb-label>
        </div>
      </div>
    </rio-container>
  `
})
export class DashboardPage {
  @select( state => state.ticker.get( 'currentTicker' ) ) private ticker$;
  @select(state => state.ticker.get('evolutions')) private evolutions$;

  private evolutions: Array<Evolution> = [];

  ngOnInit() {
    this.evolutions$
      .filter((value) => value)
      .map((value) => value.toJS())
      .subscribe((evolutions) => {
        this.evolutions = evolutions;
      });
  }

  private getGoalMessage(goal: Goal) {
    let action = goal.isBuy ? 'Buy ' : 'Sell ';
    return `${action} at ${goal.price}`;
  }

  private getMarketValue(evolution: Evolution) {
    let value = (evolution.price * evolution.ownedStocks.length) + evolution.cashflow;
    return `$ ${value}`;
  }
}
