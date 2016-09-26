import {Routes} from '@angular/router';
import {DashboardPage} from '../pages/dashboard.page';
import {WebSimulationPage} from '../pages/web-simulation';
import {
  RioCounterPage,
  RioAboutPage
} from '../pages';

export const SAMPLE_APP_ROUTES: Routes = [{
  pathMatch: 'full',
  path: '',
  redirectTo: 'counter'
}, {
  path: 'counter',
  component: RioCounterPage
}, {
  path: 'about',
  component: RioAboutPage
}, {
  path: 'dashboard',
  component: DashboardPage
}, {
  path: 'web',
  component: WebSimulationPage
}];
