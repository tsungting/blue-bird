import {Routes} from '@angular/router';
import {DashboardPage} from '../pages/dashboard.page';
import {WebSimulationPage} from '../pages/web-simulation';
import {WebAnalyzerPage} from '../pages/web-analyzer';
import {MultiStockAnalyzer} from '../pages/multi-stock-analyzer';

import {
  RioCounterPage,
  RioAboutPage
} from '../pages';

export const SAMPLE_APP_ROUTES: Routes = [{
  pathMatch: 'full',
  path: '',
  redirectTo: 'web-analyzer'
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
}, {
  path: 'web-analyzer',
  component: WebAnalyzerPage
}, {
  path: 'multi-stock-analyzer',
  component: MultiStockAnalyzer
}];
