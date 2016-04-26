import {
  Component,
  ViewEncapsulation,
  Inject,
  ApplicationRef
} from 'angular2/core';

import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { AsyncPipe } from 'angular2/common';
import { Observable } from 'rxjs';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';

import { SessionActions } from '../actions/session';
import { RioAboutPage } from './about-page';
import { RioCounterPage } from './counter-page';

import {
  RioButton,
  RioNavigator,
  RioNavigatorItem,
  RioLogo,
  RioLoginModal
} from '../components';

import {IAppState} from './app-state';
import {NgRedux} from 'ng2-redux';

@Component({
  selector: 'rio-sample-app',
  directives: [
    ROUTER_DIRECTIVES, RioNavigator, RioNavigatorItem,
    RioLoginModal, RioLogo, RioButton
  ],
  pipes: [ AsyncPipe ],
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [require('../styles/index.css')],
  template: `
    <div>
      <rio-login-modal
        (onSubmit)="login($event)"
        [hasError]="hasError$ | async"
        [isPending]="isLoading$ | async"
        *ngIf="loggedOut$ | async">
      </rio-login-modal>
      <rio-navigator>
        <rio-navigator-item [mr]=true>
          <rio-logo></rio-logo>
        </rio-navigator-item>
        <rio-navigator-item *ngIf="loggedIn$ | async" [mr]=true>
          <a [routerLink]="['Counter']"
            class="text-decoration-none">Counter</a>
        </rio-navigator-item>
        <rio-navigator-item *ngIf="loggedIn$ | async">
          <a [routerLink]="['About']"
            class="text-decoration-none">About Us</a>
        </rio-navigator-item>

        <div class="flex flex-auto"></div>

        <rio-navigator-item *ngIf="loggedIn$ | async" [mr]=true>
          {{ userName$ | async }}
        </rio-navigator-item>
        <rio-navigator-item [hidden]="loggedOut$ | async">
          <rio-button className="bg-red white" (click)="logout()" >
            Logout
          </rio-button>
        </rio-navigator-item>
      </rio-navigator>
      <main>
        <router-outlet *ngIf="loggedIn$ | async"></router-outlet>
      </main>
    </div>
  `
})
@RouteConfig([
  {
    path: '/counter',
    name: 'Counter',
    component: RioCounterPage,
    useAsDefault: true
  },
  {
    path: '/about',
    name: 'About',
    component: RioAboutPage
  }
])
export class RioSampleApp {
  private hasError$: Observable<boolean>;
  private isLoading$: Observable<boolean>;
  private loggedIn$: Observable<boolean>;
  private loggedOut$: Observable<boolean>;
  private userName$: Observable<string>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private applicationRef: ApplicationRef,
    private sessionActions: SessionActions) {
  }

  ngOnInit() {
    const session$: Observable<Map<string, any>>
      = this.ngRedux.select('session');

    this.hasError$ = session$.map(s => !!s.get('hasError'));
    this.isLoading$ = session$.map(s => !!s.get('isLoading'));
    this.loggedIn$ = session$.map(s => !!s.get('token'));
    this.loggedOut$ = this.loggedIn$.map(loggedIn => !loggedIn);

    this.userName$ = session$.map(s => {
        return [
          s.getIn(['user', 'firstName'], ''),
          s.getIn(['user', 'lastName'], '')
         ].join(' ');
      });

    this.ngRedux.mapDispatchToTarget(this.mapDispatchToThis)(this);
  }

  mapDispatchToThis = (dispatch) => {
    const { loginUser, logoutUser } = this.sessionActions;

    return {
      login: (credentials) => dispatch(loginUser(credentials)),
      logout: () => dispatch(logoutUser())
    };
  };
};
