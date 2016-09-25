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

      <bb-evolution-log
        [evolutions]="evolutions"
      ></bb-evolution-log>
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
        this.evolutions = evolutions.slice(1);
      });
  }
}
