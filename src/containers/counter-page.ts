import { Component, Inject, ApplicationRef } from 'angular2/core';
import { bindActionCreators } from 'redux';
import { AsyncPipe } from 'angular2/common';
import { NgRedux } from 'ng2-redux';
import { CounterActions } from '../actions/counter';
import { RioContainer, RioCounter } from '../components';
import { IAppState } from './app-state';

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
export class RioCounterPage {
  private counter$: any;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private counterActions: CounterActions) {}

  ngOnInit() {
    this.counter$ = this.ngRedux
      .select(n => n.counter.get('count'));

    this.ngRedux.mapDispatchToTarget({
      increment: this.counterActions.increment,
      decrement: this.counterActions.decrement
    })(this);
  }
}
