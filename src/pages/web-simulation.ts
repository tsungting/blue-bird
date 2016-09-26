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
        <h2 class="caps">start ticker</h2> <button class="btn btn-primary" (click)="startWebTicker()">Go</button>
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
  @select(state => state.ticker.get('evolutions')) private evolutions$;

  private evolutions: Array<Evolution> = [];

  constructor(private tickerActions: TickerActions) {
  }

  ngOnInit() {
    this.evolutions$
      .filter((value) => value)
      .map((value) => value.toJS())
      .subscribe((evolutions) => {
        this.evolutions = evolutions.slice(1);
      });
  }


  public startWebTicker() {
    this.tickerActions.getWebTicker();
  }
}
