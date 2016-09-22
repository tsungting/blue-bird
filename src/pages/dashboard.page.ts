import { Component } from '@angular/core';
import { RioContainer } from '../components';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'rio-dashboard-page',
  template: `
    <rio-container [size]=4 [center]=true>
      <h2 class="caps">Dashboard</h2>
      <p>
        Rangle.io is a next-generation HTML5 design and development firm
        dedicated to modern, responsive web and mobile applications.
      </p>
      <label>Current Ticker</label>
      <div>{{ticker$ | async}}</div>
    </rio-container>
  `
})
export class DashboardPage {
  @select(state=>state.ticker.currentTicker) private ticker$;

  ngOnInit(){
    //debugger;
  }

}
