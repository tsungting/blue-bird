import { Component, Inject, ApplicationRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { bindActionCreators } from 'redux';
import { select, dispatchAll } from 'ng2-redux';
import * as counterActions from '../actions/counter';
import { Observable } from 'rxjs/Observable';
import { RioContainer, RioCounter } from '../components';

@Component({
  selector: 'counter-page',
  directives: [RioContainer, RioCounter],
  pipes: [AsyncPipe],
  template: `
    <rio-container [size]=2 [center]=true>
      <h2 id="qa-counter-heading"
        class="center caps">
        Counter
      </h2>

      <rio-counter
        [counter]="counter$ | async"
        [increment]="increment"
        [decrement]="decrement">
      </rio-counter>
    </rio-container>
  `
})
@dispatchAll(counterActions)
export class RioCounterPage {
  @select(n => n.counter.get('count')) private counter$: Observable<number>;
}
